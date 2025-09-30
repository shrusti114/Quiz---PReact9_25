const mcsSubjects = {
  "Angular": [
    { question: "Who developed Angular?", options: ["Google","Facebook","Microsoft","Twitter"], answer: "Google" },
    { question: "Angular is a ______ framework?", options: ["Backend","Frontend","Full-stack","Database"], answer: "Frontend" },
    { question: "Which directive is used for looping in Angular?", options: ["*ngIf","*ngFor","*ngSwitch","*ngLoop"], answer: "*ngFor" },
    { question: "Which lifecycle hook is called after Angular creates a component?", options: ["ngOnInit","ngAfterViewInit","ngDoCheck","ngAfterContentInit"], answer: "ngOnInit" },
    { question: "Which decorator is used to define a component?", options: ["@NgModule","@Injectable","@Component","@Directive"], answer: "@Component" },
    { question: "Angular uses which language by default?", options: ["JavaScript","TypeScript","Python","Java"], answer: "TypeScript" },
    { question: "Which module is used for routing in Angular?", options: ["RouterModule","RoutesModule","AppModule","HttpModule"], answer: "RouterModule" },
    { question: "Which directive is used for conditionals in Angular?", options: ["*ngIf","*ngFor","*ngSwitch","*ngLoop"], answer: "*ngIf" },
    { question: "Which service is used for HTTP requests?", options: ["HttpClient","HttpService","HttpRequest","HttpModule"], answer: "HttpClient" },
    { question: "Which Angular CLI command is used to generate a service?", options: ["ng generate service","ng create service","ng new service","ng add service"], answer: "ng generate service" },
    { question: "Which decorator is used to inject services in Angular?", options: ["@Injectable","@Component","@NgModule","@Directive"], answer: "@Injectable" },
    { question: "What is the command to start Angular development server?", options: ["ng start","ng serve","npm start","npm serve"], answer: "ng serve" },
    { question: "Which module is used for forms in Angular?", options: ["FormsModule","ReactiveFormsModule","FormModule","NgFormModule"], answer: "FormsModule" },
    { question: "Which pipe is used to format dates in Angular?", options: ["date","datetime","formatDate","datePipe"], answer: "date" },
    { question: "Which command creates a new Angular project?", options: ["ng create project","ng new project","ng add project","ng generate project"], answer: "ng new project" },
  ],

  "Python": [
    { question: "Which keyword is used to define a function in Python?", options: ["function","def","fun","define"], answer: "def" },
    { question: "Which of these is a mutable data type?", options: ["tuple","list","string","int"], answer: "list" },
    { question: "Which operator is used for exponentiation in Python?", options: ["^","**","%","//"], answer: "**" },
    { question: "Which keyword is used for conditional statements?", options: ["if","for","while","switch"], answer: "if" },
    { question: "Which method converts a string to lowercase?", options: ["lower()","toLowerCase()","tolower()","lowercase()"], answer: "lower()" },
    { question: "Which keyword is used to handle exceptions?", options: ["try","catch","except","error"], answer: "except" },
    { question: "How do you start a comment in Python?", options: ["//","#","/*","<!--"], answer: "#" },
    { question: "Which operator is used for floor division?", options: ["/","//","%","**"], answer: "//" },
    { question: "Which method returns the length of a list?", options: ["length()","len()","size()","count()"], answer: "len()" },
    { question: "Which statement is used to create a class?", options: ["class","object","struct","define"], answer: "class" },
    { question: "Which function is used to read input from user?", options: ["read()","input()","scanf()","cin"], answer: "input()" },
    { question: "Which data type is immutable in Python?", options: ["list","dict","tuple","set"], answer: "tuple" },
    { question: "Which keyword is used to import modules?", options: ["import","include","using","require"], answer: "import" },
    { question: "Which loop runs a fixed number of times?", options: ["for","while","do-while","loop"], answer: "for" },
    { question: "Which method removes the last item from a list?", options: ["remove()","pop()","delete()","clear()"], answer: "pop()" },
  ],
};

export default mcsSubjects;
