### Question 1. Which of the following is NOT a goal of pair programming?
- Option A Staff training and transition are eased
- Option B Higher quality code with fewer defects is produced
- Option C A pair completes their tasks in less than half the time of a solo programmer completing the same tasks in terms of total person-hours ✅
- Option D Faster problem-solving and quicker decision-making processes

### Question 2. Which of the following is LEAST likely to be used for project/task planning?
- Option A Profiler tool ✅
- Option B Gantt chart
- Option C Trello tool
- Option D PERT technique

### Question 3. Which is the most desirable process methodology for the following project? Ten experienced developers and ten new graduates are working on improving the efficiency of Amazon’s web-based order processing software. Five of the developers work in Champaign and the rest in Chicago. The application is fairly large – about 100 thousand lines of code. Fortunately, the team is mainly re-implementing the order processing functionality – but is just working to make the algorithms and database transactions more efficient so the requirements are fairly stable. One more thing – the team is mostly made up of people who like their work assignments to be predictable for quite a long period of time.
- Option A Plan-driven methodology ✅
- Option B Agile methodology

### Question 4. Choose words that most accurately and correctly complete the following sentence: With a/an _________ software process model, requirements are developed _________.
- Option A agile, continuously ✅
- Option B agile, once
- Option C spiral, once
- Option D waterfall, periodically

### Question 5. Which of the following is NOT one of the big ideas of eXtreme Programming?
- Option A Work closely with the customer
- Option B Use working code as the main written product
- Option C Design software architecture carefully before the coding phase ✅
- Option D Release code frequently

### Question 6. The component in the MVC pattern for encapsulating app state is named ______
- Option A View
- Option B Model ✅
- Option C Controller

### Question 7. Is the following statement true or false? 'A use case describes both what a system does when interacting with an actor and how the system implements the functionality.'
- Option A True
- Option B False ✅

### Question 8. In use-case requirements, a scenario is best described as
- Option A a single path through a use case’s flow of events ✅
- Option B describing the ‘best case’ (no error conditions) of a requirement
- Option C a document for helping developers write unit test cases
- Option D a group of user stories

### Question 9. Requirements validation involves examining customer requirements for all of the criteria below except:
- Option A Coupling ✅
- Option B Completeness
- Option C Unambiguity
- Option D Consistency

### Question 10. Which of the following best denotes the relationship in a class diagram between the Library class and the CheckOutCounter class, where the CheckOutCounter is a part of the Library and cannot exist without it?
- Option A Abstraction
- Option B Generalization
- Option C Cohesion
- Option D Composition ✅

### Question 11. In class diagrams, _________ is indicated by a/an _________ .
- Option A Aggregation, solid arrow
- Option B Multiplicity, dotted line
- Option C Generalization/inheritance, hollow arrow ✅
- Option D Class, oval

### Question 12. Why is UML a significant development?
- Option A It was developed as a marketing strategy to sell more software design tools.
- Option B It provides a tool for automatically converting diagrams into fully functional code without additional development effort.
- Option C It unifies the various systems for drawing requirements, designs, etc. into a common framework allowing users to share diagrams and understand their semantics. ✅
- Option D It was primarily created to replace all forms of programming with visual modeling.

### Question 13. Is the following statement true or false? 'In a sequence diagram, neither the horizontal ordering of the objects nor the vertical ordering of the messages matters. That is, we can freely shuffle their orderings without changing the meaning of the sequence diagram.'
- Option A True
- Option B False ✅

### Question 14. Which of the following is NOT a part of UML?
- Option A Sequence diagram
- Option B Use-case diagram
- Option C Class diagram
- Option D User stories ✅

### Question 15. Objects that model a uniform, coherent concept exhibit __________ . Objects that have complex interrelationships with many other objects exhibit __________ .
- Option A low cohesion, low coupling
- Option B high cohesion, high coupling ✅
- Option C low cohesion, high coupling
- Option D high cohesion, low coupling

### Question 16. Which of the following design patterns is the most suitable for being used to design the following system? One popular feature on YouTube is to allow users to subscribe and unsubscribe to a channel. Whenever there is a new video published on to the channel, all the subscribers are informed of this new video. In this question, we will use object-oriented design to model a simplified version of this Channel-User relationship. Here are the requirements: 1. There are two classes, Channel and User. 2. When a user subscribes to a Channel, the user becomes a subscriber. 3. A Channel can be subscribed to and unsubscribed from by calling its subscribe() and unsubscribe() methods. 4. A Channel maintains a list of all the subscribers. 5. A User maintains a list called videoList, which contains the titles of all the videos from all the channels the user has subscribed to. 6. A Channel has a notifyNewVideo() method. When this method is called with the title of the new video as a parameter, all its subscribers should add this title to their videoList.
- Option A Strategy Pattern
- Option B Composite Pattern
- Option C Observer Pattern ✅
- Option D Visitor Pattern

### Question 17. Which coverage below is also called branch coverage?
- Option A loop coverage
- Option B condition coverage
- Option C decision coverage ✅
- Option D statement coverage

### Question 18. Which white box testing guideline is the most difficult to achieve among the three?
- Option A 100% Branch coverage ✅
- Option B 100% Statement coverage
- Option C 100% Method coverage

### Question 19. Consider the following code, which takes two integers as an input and prints messages indicating the sign of inputs. What is the minimum number of tests to achieve 100% statement coverage? (Hint: Each combination of x and y values is considered one test. For example, one test could be both x and y to be positive) public void print(int x, int y) { int sum = x + y; int mul = x * y; if (sum >= 0 && mul >= 0) { System.out.println("all greater or equal to 0"); } else { if (sum < 0) { System.out.println("sum is negative"); } else { System.out.println("sum is greater or equal to 0"); } } }
- Option A 4
- Option B 3
- Option C 5
- Option D 7

### Question 20. Consider the following code, which takes two integers as an input and prints messages indicating the sign of inputs (this is the same code as the previous question). What is the minimum number of tests to achieve 100% branch coverage? public void print(int x, int y) { int sum = x + y; int mul = x * y; if (sum >= 0 && mul >= 0) { System.out.println("all greater or equal to 0"); } else { if (sum < 0) { System.out.println("sum is negative"); } else { System.out.println("sum is greater or equal to 0"); } } }
- Option A 6
- Option B 2
- Option C 4
- Option D 3 ✅

### Question 21. Consider the following code, which takes two integers as an input and prints messages indicating the sign of inputs (this is the same code as the previous question). What is the minimum number of tests to achieve 100% condition coverage? public void print(int x, int y) { int sum = x + y; int mul = x * y; if (sum >= 0 && mul >= 0) { System.out.println("all greater or equal to 0"); } else { if (sum < 0) { System.out.println("sum is negative"); } else { System.out.println("sum is greater or equal to 0"); } } }
- Option A 8
- Option B 2
- Option C 4
- Option D 3

### Question 22. Which of the following indicates the main purpose of verification?
- Option A Make sure that the right product is being built
- Option B Make sure that the product is being built right ✅
- Option C Make sure that the budget is not overrun
- Option D Make sure that the product delivery is not delayed

### Question 23. Is the following statement true or false? 'For the following method, if test cases can achieve 100% statement coverage, the same set of test cases can definitely achieve 100% branch coverage.' public int method (int x) { if (x > 10) { x = x + 3; } else { x = x + 4; } return x; }
- Option A False
- Option B True

### Question 24. Which statement best expresses the main purpose of test oracles?
- Option A Help determine whether a test passes or fails ✅
- Option B Help test interactions between a database application and a database
- Option C Help test interaction between components
- Option D Store a specified input of a test in a test database

### Question 25. Which of the following best describes an example of a failure?
- Option A A static analysis tool detects that some code portions may have a possible deadlock
- Option B A programmer makes a mistake and forgets to write a conditional check in his/her code
- Option C The execution of a test case causes the violation of an assertion in the test case ✅