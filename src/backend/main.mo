import Array "mo:core/Array";
import Text "mo:core/Text";
import List "mo:core/List";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Blob "mo:core/Blob";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import ExternalBlob "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  type Image = Blob;
  type Badge = Text;
  type URL = Text;
  type Timestamp = Int;
  type XP = Nat;
  type Level = Nat;
  type Coins = Nat;
  type ReminderId = Nat;
  type TaskId = Nat;

  type Recurrence = {
    #daily;
    #weekly : [Bool];
    #custom : [Timestamp]; // Array of custom days as timestamps
  };

  type Priority = {
    #low;
    #medium;
    #high;
  };

  type ProofType = {
    #textNote : Text;
    #checklistConfirmation : [Bool];
    #timedSessionLog : Nat; // Duration in minutes
    #photoUpload : URL;
  };

  type Task = {
    id : TaskId;
    title : Text;
    description : Text;
    category : Text;
    priority : Priority;
    recurrence : Recurrence;
    targetTimes : [Timestamp];
    gracePeriod : Nat; // In minutes
    estimatedDuration : ?Nat; // In minutes
    creationTime : Timestamp;
    dbBlobImage : ?ExternalBlob.ExternalBlob;
  };

  module Task {
    public func compare(task1 : Task, task2 : Task) : Order.Order {
      Nat.compare(task1.id, task2.id);
    };
  };

  type Reminder = {
    id : ReminderId;
    taskId : TaskId;
    scheduledTime : Timestamp;
    isRereminder : Bool;
  };

  type Completion = {
    taskId : TaskId;
    proof : ProofType;
    reflection : Text;
    completionTime : Timestamp;
  };

  type Reward = {
    xpGained : XP;
    coinsGained : Coins;
    levelUp : Bool;
    streakBonus : Bool;
    badges : [Badge];
  };

  type UserProfile = {
    displayName : Text;
    avatarUrl : ?ExternalBlob.ExternalBlob;
    totalXP : XP;
    level : Level;
    coins : Coins;
    badges : [Badge];
    streakCount : Nat;
  };

  let nextTaskId = Map.empty<Principal, TaskId>();

  // Storage - keyed by Principal (caller)
  let users = Map.empty<Principal, UserProfile>();
  let tasks = Map.empty<Principal, List.List<Task>>();
  let reminders = Map.empty<Principal, List.List<Reminder>>();
  let completions = Map.empty<Principal, List.List<Completion>>();
  let rewardHistory = Map.empty<Principal, List.List<Reward>>();
  let accessControlState = AccessControl.initState();

  include MixinStorage();
  include MixinAuthorization(accessControlState);

  // Required profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    users.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    users.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    users.add(caller, profile);
  };

  // Initialize user data structures
  public shared ({ caller }) func initializeUser(displayName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can initialize");
    };

    // Check if user already exists
    switch (users.get(caller)) {
      case (?_) { Runtime.trap("User already initialized") };
      case (null) {
        let newUserProfile : UserProfile = {
          displayName;
          avatarUrl = null;
          totalXP = 0;
          level = 1;
          coins = 0;
          badges = [];
          streakCount = 0;
        };

        users.add(caller, newUserProfile);
        tasks.add(caller, List.empty<Task>());
        reminders.add(caller, List.empty<Reminder>());
        completions.add(caller, List.empty<Completion>());
        rewardHistory.add(caller, List.empty<Reward>());
        nextTaskId.add(caller, 0);
      };
    };
  };

  private func _incrementTaskId(userId : Principal) : TaskId {
    let currentId = switch (nextTaskId.get(userId)) {
      case (null) { 0 };
      case (?id) { id };
    };

    let newId = currentId + 1;
    nextTaskId.add(userId, newId);
    newId;
  };

  public shared ({ caller }) func createTask(task : Task) : async TaskId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create tasks");
    };

    let newTaskId = _incrementTaskId(caller);
    let updatedTask : Task = {
      task with id = newTaskId;
    };

    switch (tasks.get(caller)) {
      case (null) {
        // Initialize if not exists
        let newList = List.empty<Task>();
        newList.add(updatedTask);
        tasks.add(caller, newList);
      };
      case (?userTasks) {
        userTasks.add(updatedTask);
        tasks.add(caller, userTasks);
      };
    };

    newTaskId;
  };

  public query ({ caller }) func getUserStatsByLevel(minLevel : Level, maxLevel : Level) : async {
    started : Nat;
    completed : Nat;
    failed : Nat;
    inProgress : Nat;
    XP : XP;
    Coins : Coins;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view stats");
    };

    if (minLevel > maxLevel) {
      Runtime.trap("Invalid level range");
    };

    let userTasks = switch (tasks.get(caller)) {
      case (null) { List.empty<Task>() };
      case (?taskList) { taskList };
    };

    var completed = 0;
    for (task in userTasks.values()) {
      if (task.id >= minLevel and task.id <= maxLevel) {
        completed += 1;
      };
    };

    let userStats : { completed : Nat; totalXP : XP; totalCoins : Coins } = switch (users.get(caller)) {
      case (null) { { completed; totalXP = 0; totalCoins = 0 } };
      case (?profile) { { completed; totalXP = profile.totalXP; totalCoins = profile.coins } };
    };

    {
      started = userTasks.size();
      completed;
      failed = 0;
      inProgress = 0;
      XP = userStats.totalXP;
      Coins = userStats.totalCoins;
    };
  };

  public query ({ caller }) func getAverageCompletionTime(startTime : Nat, endTime : Nat) : async {
    avgTime : Float;
    nTasks : Nat;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view completion stats");
    };

    if (startTime > endTime) {
      Runtime.trap("Invalid time range");
    };

    let userCompletions = switch (completions.get(caller)) {
      case (null) { 
        return { avgTime = 0.0; nTasks = 0 };
      };
      case (?compList) {
        var totalTime : Int = 0;
        var count = 0;
        for (completion in compList.values()) {
          if (completion.completionTime >= startTime and completion.completionTime <= endTime) {
            count += 1;
            totalTime += completion.completionTime;
          };
        };
        if (count == 0) {
          return { avgTime = 0.0; nTasks = 0 };
        };
        let avg = totalTime.toFloat() / count.toFloat();
        return { avgTime = avg; nTasks = count };
      };
    };
  };

  public query ({ caller }) func getUserTask(taskId : TaskId) : async Task {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view tasks");
    };

    switch (tasks.get(caller)) {
      case (null) { Runtime.trap("Task does not exist") };
      case (?userTasks) {
        let foundTask = userTasks.toArray().find(
          func(task : Task) : Bool { task.id == taskId }
        );
        switch (foundTask) {
          case (null) { Runtime.trap("Task does not exist") };
          case (?task) { task };
        };
      };
    };
  };

  public query ({ caller }) func getUserTasks() : async [Task] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view tasks");
    };

    switch (tasks.get(caller)) {
      case (null) { [] };
      case (?taskList) {
        taskList.toArray();
      };
    };
  };

  public shared ({ caller }) func updateTask(task : Task) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update tasks");
    };

    switch (tasks.get(caller)) {
      case (null) { Runtime.trap("Task does not exist!") };
      case (?taskList) {
        let taskArray = taskList.toArray();
        let foundTask = taskArray.find(func(t : Task) : Bool { t.id == task.id });
        
        switch (foundTask) {
          case (null) { Runtime.trap("Task does not exist") };
          case (?_) {
            let updatedTaskList = Array.tabulate(
              taskArray.size(),
              func(i : Nat) : Task { 
                if (Nat.equal(i, i)) { task } else { taskArray[i] } 
              },
            );
            tasks.add(caller, List.fromArray<Task>(updatedTaskList));
          };
        };
      };
    };
  };

  public shared ({ caller }) func addTaskImage(taskId : TaskId, image : Image) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add task images");
    };

    switch (tasks.get(caller)) {
      case (null) { Runtime.trap("Task does not exist!") };
      case (?taskList) {
        let updatedTaskList = taskList.map<Task, Task>(
          func(task : Task) : Task {
            if (task.id == taskId) { 
              { task with dbBlobImage = ?((image : ExternalBlob.ExternalBlob)) } 
            } else { 
              task 
            };
          }
        );
        tasks.add(caller, updatedTaskList);
      };
    };
  };

  public shared ({ caller }) func deleteTask(taskId : TaskId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete tasks");
    };

    switch (tasks.get(caller)) {
      case (null) { Runtime.trap("Task does not exist!") };
      case (?taskList) {
        let filteredTasks = taskList.filter(
          func(task : Task) : Bool { task.id != taskId }
        );
        tasks.add(caller, filteredTasks);
      };
    };
  };

  public shared ({ caller }) func addCompletion(completion : Completion) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add completions");
    };

    switch (completions.get(caller)) {
      case (null) {
        let newList = List.empty<Completion>();
        newList.add(completion);
        completions.add(caller, newList);
      };
      case (?compList) {
        compList.add(completion);
        completions.add(caller, compList);
      };
    };
  };

  public query ({ caller }) func getCompletions() : async [Completion] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view completions");
    };

    switch (completions.get(caller)) {
      case (null) { [] };
      case (?compList) { compList.toArray() };
    };
  };

  public shared ({ caller }) func addReward(reward : Reward) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add rewards");
    };

    switch (rewardHistory.get(caller)) {
      case (null) {
        let newList = List.empty<Reward>();
        newList.add(reward);
        rewardHistory.add(caller, newList);
      };
      case (?rewardList) {
        rewardList.add(reward);
        rewardHistory.add(caller, rewardList);
      };
    };
  };

  public query ({ caller }) func getRewardHistory() : async [Reward] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view reward history");
    };

    switch (rewardHistory.get(caller)) {
      case (null) { [] };
      case (?rewardList) { rewardList.toArray() };
    };
  };

  public shared ({ caller }) func addReminder(reminder : Reminder) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add reminders");
    };

    switch (reminders.get(caller)) {
      case (null) {
        let newList = List.empty<Reminder>();
        newList.add(reminder);
        reminders.add(caller, newList);
      };
      case (?reminderList) {
        reminderList.add(reminder);
        reminders.add(caller, reminderList);
      };
    };
  };

  public query ({ caller }) func getReminders() : async [Reminder] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view reminders");
    };

    switch (reminders.get(caller)) {
      case (null) { [] };
      case (?reminderList) { reminderList.toArray() };
    };
  };

  // Admin function to view any user's profile (for moderation/support)
  public query ({ caller }) func adminGetUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view other users' profiles");
    };
    users.get(user);
  };
};
