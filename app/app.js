// Input files are an array of strings to file-paths
const inputFiles = []

// Output directory is a string to an output path
const outputDir = ""

// Input file types are an enum of strings
const InputExt = Object.freeze({
  DOCX: 'docx',
  DOC: 'doc',
  ODT: 'odt',
  MD: 'md',
  TXT: 'txt'
});

// The group of pandoc writers is an array of objects with info on each one
const writers = Object.freeze({
  "ames-guide-auto": {
    dir: "ames-guide",
    lua: "ames-guide-auto",
    label: "Ames Guide (Auto Numbering)",
    supportedInput: ["docx", "doc", "odt", "md"],
    settings: {
      pageHeadingLvl: {
        type: "number",
        default: 1,
        label: "Page Heading Level",
        min: 1,
        max: 6
      },
      srcHeadingLvl: {
        type: "number",
        default: 3,
        label: "Lettering Source Level",
        min: 1,
        max: 6
      },
      blankPageSeparators: {
        type: "checkbox",
        default: false,
        label: "Separate pages with a row of blanks."
      },
      labeledPageSeparators: {
        type: "checkbox",
        default: false,
        label: "Separate pages with a labeled \"Page (#)\" row."
      },
      removeDuplicateLines: {
        type: "checkbox",
        default: false,
        label: "Remove potential duplicate lines. Leave unchecked if you have instances of repeating lines in your script."
      }
    },
    info: {
      intro: "A parser based on Steenz's Standard Comic Script Template.",
      worksBest: [
        "Pages and lettering sources each share a consistent heading level across the whole document.",
        "Lettering lines are either plain paragraphs, ordered lists, or block quotes."
      ]
    }
  },
  "ames-guide-cont": {
    dir: "ames-guide",
    lua: "ames-guide-cont-friendly",
    label: "Ames Guide (Continue Friendly)",
    supportedInput: ["docx", "doc", "odt", "md"],
    settings: {
      pageHeadingLvl: {
        type: "number",
        default: 1,
        label: "Page Heading Level",
        min: 1,
        max: 6
      },
      srcHeadingLvl: {
        type: "number",
        default: 3,
        label: "Lettering Source Level",
        min: 1,
        max: 6
      },
      blankPageSeparators: {
        type: "checkbox",
        default: false,
        label: "Separate pages with a row of blanks."
      },
      labeledPageSeparators: {
        type: "checkbox",
        default: false,
        label: "Separate pages with a labeled \"Page (#)\" row."
      },
      removeDuplicateLines: {
        type: "checkbox",
        default: false,
        label: "Remove potential duplicate lines. Leave unchecked if you have instances of repeating lines in your script."
      }
    },
    info: {
      intro: "A parser based on Steenz's Standard Comic Script Template. This version is useful if you have scripts where one comic page spans multiple script pages.",
      worksBest: [
        "Pages and lettering sources each share a consistent heading level across the whole document.",
        "Page continuation headers of the same number start with that same number, followed by some sort of \"continued\" marker.",
        "Lettering lines are either plain paragraphs, ordered lists, or block quotes."
      ]
    }
  },
  "moon-crystal": {
    dir: "moon-crystal",
    lua: "moon-crystal",
    label: "Moon Crystal",
    supportedInput: ["md", "txt"],
    settings: {
      ignoredSpeakers: {
        type: "stringList",
        label: "Ignored Speakers",
        default: [
          "Description",
          "Notes",
          "Action"
        ],
        placeholder: "Speaker name"
      },
      blankPageSeparators: {
        type: "checkbox",
        default: false,
        label: "Separate pages with a row of blanks."
      },
      labeledPageSeparators: {
        type: "checkbox",
        default: false,
        label: "Separate pages with a labeled \"Page (#)\" row."
      }
    },
    info: {
      intro: "A parser based on Halftone Hospital's Obsidian plugin, Comic Scripter. And, in turn, the comic scripting software, SuperScript",
      worksBest: [
        "Pages and lettering sources each share a consistent heading level across the whole document.",
        "Lettering lines are either plain paragraphs, ordered lists, or block quotes."
      ]
    }
  }
});

// The group of pandoc filters is an array of objects with info on each one
const filters = Object.freeze({
  "double-to-em-dash": {
    label: "Double Dash → Em-Dash",
    info: "Replace double dashes \"--\" with em-dashes \"—\" (which get use in some manga style guides) without using the \"smart\" extension, which also targets ellipses (…) and curly quotes."
  },
  "em-to-double-dash": {
    label: "Em-Dash to Double Dash",
    info: "Replace em-dashes \"—\" with double dashes \"--\" (which some publishers/cartoonists prefer) without using the \"smart\" extension, which also targets ellipses (…) and curly quotes."
  },
  "lowercase-midword-i": {
    label: "Lowercase Midword i",
    info: "When a word has an uppercase I in the middle of it, convert to lowercase, so that the barred-pronoun-I does not get triggered in all-caps comic fonts in non-pronoun use."
  },
  "lowercase-wordstart-i": {
    label: "Lowercase Word-Start i",
    info: "When a word starts with an uppercase \"I\" but is immediately followed by lowercase alphabet character, convert to a lowercase \"i\". This converts \"I\" to lowercase when at the start of a non-pronoun word. Useful for dodging the barred \"I\" character within non-pronoun \"I\" use when using all-uppercase comic fonts."
  }
});

// How to make user settings from defaults
/* {
  let currentWriter = "moon-crystal";

  let userSettings = structuredClone(
      writers[currentWriter].settings
);
} */

// How to change them when the user swaps out
/* {
  currentWriter = "ames-guide-auto";

  userSettings = structuredClone(
      writers[currentWriter].settings
);
} */