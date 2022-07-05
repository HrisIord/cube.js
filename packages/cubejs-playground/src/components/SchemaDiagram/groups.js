const colours = {
  pewter: "rgb(97, 109, 136)",
  coin: "rgb(141, 155, 177)",
  paleblue: "rgb(198, 218, 231)",
  cloud: "rgb(198, 218, 231)",
  tan: "rgb(246, 198, 172)",
  magnolia: "rgb(246, 234, 228)",
  flipflop: "rgb(240, 188, 162)",
};

export const groups = [
  {
    name: "Library Space",
    colour: colours.tan,
    cubes: [
      "LibraryProblem",
      "LibraryTask",
      "LibraryComponent",
      "LibraryProblemCweSet",
      "LibraryStandardInComplianceRegulation",
      "RegulationSection",
      "Regulation",
      "Phase",
      "TaskStatus",
    ],
  },
  {
    name: "Application Space",
    colour: colours.coin,
    cubes: [
      "BusinessUnit",
      "Application",
      "ApplicationCustomAttributes",
      "ProjectComponent",
      "ProjectProblem",
    ],
    groups: [
      {
        name: "Project Cubes",
        colour: colours.cloud,
        cubes: [
          "Project",
          "ProjectCreatorUser",
          "ProjectProfile",
          "ProjectRiskCompliance",
          "ProjectRiskClassification",
          "ProjectSurveyAnswers",
          "ProjectSurveyAnswersActor",
          "ProjectCustomAttributes",
        ],
      },
      {
        name: "Task Cubes",
        colour: colours.cloud,
        cubes: [
          "Task",
          "TaskModifiedUser",
          "TaskNotes",
          "TaskNotesUpdater",
          "TaskRiskRelevance",
          "TaskVerificationStatus",
          "TaskAssigned",
          "LatestTaskVerification",
          "VerificationModifierUser",
        ],
      },
      {
        name: "Sync Stuff",
        colour: colours.cloud,
        cubes: [
          "ExternalSyncJobAll",
          "ProjectConnection",
          "ExternalSyncJobLast",
        ],
      },
    ],
  },
  {
    name: "Organization Cubes",
    colour: colours.paleblue,
    cubes: ["Organization", "User"],
  },
  {
    name: "Risk Policies",
    colour: colours.flipflop,
    cubes: ["RiskClassification", "RiskPolicy"],
  },
];
