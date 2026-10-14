import { SupportedLanguages } from "@/interfaces/language.interface";
import { InputFormat, OutputFormat } from "@/interfaces/problem.interface";

export const generateBoilerPlate = (
  inputFormat: InputFormat,
  outputFormat: OutputFormat,
  language: SupportedLanguages,
) => {
  const style = inputFormat.style; // function or class
  const name = inputFormat.name; // function or class name
  const methodName = inputFormat.method ?? "solve";

  const definitionComment = getDataStructureComment(
    inputFormat,
    outputFormat,
    language,
  );

  let boilerPlate: string = "";
  let parameters: string = "";

  switch (language) {
    case "javascript":
      parameters = inputFormat.params.map((param) => param.name).join(", "); // parameters
      boilerPlate =
        definitionComment +
        (style === "class"
          ? `class ${name} {\n\t${methodName}(${parameters}) {\n\t\t\n\t}\n}`
          : `function ${name}(${parameters}) {\n\t\n}`);
      break;
    case "php":
      parameters = inputFormat.params
        .map((param) => `$${param.name}`)
        .join(", ");
      boilerPlate = `<?php\n\n${definitionComment}${
        style === "class"
          ? `class ${name} {\n\tpublic function ${methodName}(${parameters}) {\n\t\t\n\t}\n}\n\n?>`
          : `function ${name}(${parameters}) {\n\t\n}\n\n?>`
      }`;
      break;
    case "java":
      parameters = inputFormat.params
        .map((param) => `${getJavaType(param.type)} ${param.name}`)
        .join(", ");
      boilerPlate =
        definitionComment +
        (style === "class"
          ? `static class ${name} {\n\tpublic ${getJavaType(outputFormat.type)} ${methodName}(${parameters}) {\n\t\t\n\t}\n}`
          : `static ${getJavaType(outputFormat.type)} ${name}(${parameters}) {\n\t\n}`);
      break;
    case "python":
      parameters = style === "class"
        ? `self` + (inputFormat.params.length ? `, ${inputFormat.params.map((param) => param.name).join(", ")}` : "")
        : inputFormat.params.map((param) => param.name).join(", ");
      boilerPlate =
        definitionComment +
        (style === "class"
          ? `class ${name}:\n\tdef ${methodName}(${parameters}):\n\t\tpass`
          : `def ${name}(${parameters}):\n\tpass`);
      break;
  }

  return boilerPlate;
};

const COMMENT_PREFIX: Record<SupportedLanguages, string> = {
  javascript: "//",
  php: "//",
  java: "//",
  python: "#",
};

const TREE_NODE_DEFINITION: Record<SupportedLanguages, string[]> = {
  javascript: [
    "class TreeNode {",
    "  constructor(val = 0, left = null, right = null) {",
    "    this.val = val;",
    "    this.left = left;",
    "    this.right = right;",
    "  }",
    "}",
  ],
  php: [
    "class TreeNode {",
    "  public $val;",
    "  public $left;",
    "  public $right;",
    "  public function __construct($val = 0, $left = null, $right = null) {",
    "    $this->val = $val;",
    "    $this->left = $left;",
    "    $this->right = $right;",
    "  }",
    "}",
  ],
  java: [
    "class TreeNode {",
    "  int val;",
    "  TreeNode left;",
    "  TreeNode right;",
    "  TreeNode(int val) { this.val = val; }",
    "}",
  ],
  python: [
    "class TreeNode:",
    "  def __init__(self, val=0, left=None, right=None):",
    "    self.val = val",
    "    self.left = left",
    "    self.right = right",
  ],
};

const LIST_NODE_DEFINITION: Record<SupportedLanguages, string[]> = {
  javascript: [
    "class ListNode {",
    "  constructor(val = 0, next = null) {",
    "    this.val = val;",
    "    this.next = next;",
    "  }",
    "}",
  ],
  php: [
    "class ListNode {",
    "  public $val;",
    "  public $next;",
    "  public function __construct($val = 0, $next = null) {",
    "    $this->val = $val;",
    "    $this->next = $next;",
    "  }",
    "}",
  ],
  java: [
    "class ListNode {",
    "  int val;",
    "  ListNode next;",
    "  ListNode(int val) { this.val = val; }",
    "}",
  ],
  python: [
    "class ListNode:",
    "  def __init__(self, val=0, next=None):",
    "    self.val = val",
    "    self.next = next",
  ],
};

const isType = (type: string, target: string): boolean =>
  type.toLowerCase().replace(/\s+/g, "") === target;

const formatDefinitionComment = (
  title: string,
  definition: string[],
  language: SupportedLanguages,
): string => {
  const prefix = COMMENT_PREFIX[language];
  const lines = [
    `${title} (the sandbox provides this automatically, do not redeclare it):`,
    "",
    ...definition,
  ];

  return lines.map((line) => (line ? `${prefix} ${line}` : prefix)).join("\n");
};

const getDataStructureComment = (
  inputFormat: InputFormat,
  outputFormat: OutputFormat,
  language: SupportedLanguages,
): string => {
  const types = [
    ...inputFormat.params.map((param) => param.type),
    outputFormat.type,
  ];

  const blocks: string[] = [];

  if (types.some((type) => isType(type, "treenode"))) {
    blocks.push(
      formatDefinitionComment(
        "Definition for a binary tree node",
        TREE_NODE_DEFINITION[language],
        language,
      ),
    );
  }

  if (types.some((type) => isType(type, "listnode"))) {
    blocks.push(
      formatDefinitionComment(
        "Definition for a singly-linked list node",
        LIST_NODE_DEFINITION[language],
        language,
      ),
    );
  }

  return blocks.length ? `${blocks.join("\n\n")}\n\n` : "";
};

const getJavaType = (type: string): string => {
  const normalized = type.toLowerCase().replace(/\s+/g, "");

  const mappedTypes: Record<string, string> = {
    int: "int",
    integer: "int",
    long: "long",
    number: "int",
    double: "double",
    float: "float",
    boolean: "boolean",
    bool: "boolean",
    string: "String",
    char: "char",
    character: "char",
    object: "Object",
    treenode: "TreeNode",
    listnode: "ListNode",
    void: "void",
  };

  if (mappedTypes[normalized]) {
    return mappedTypes[normalized];
  }

  if (normalized.endsWith("[]")) {
    return `${getJavaType(normalized.slice(0, -2))}[]`;
  }

  return type;
};
