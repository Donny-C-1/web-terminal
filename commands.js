import terminal from "./script.js";

const root = "~";
let cwd = root;

const directories = {
  education: [
    "",
    "<white>education</white>",
    "* <a href='https://en.wikipedia.org/wiki/Kielce_University_of_Technology'>Kielce Univerity of Technology</a> <yellow>'Computer Science'</yellow> 2002-2007 / 2011 - 2014",
    "* <a href='https://pl.wikipedia.org/wiki/Szko%C5%82a_policealna'>Post-secondary</a> Electronic School <yellow>'Computer Systems'</yellow> 2000-2002",
    "* Electronic <a href='https://en.wikipedia.org/wiki/Technikum_(Polish_education)'>Technikum</a> with major <yellow>'RTV'</yellow> 1995-2000",
    "",
  ],
  projects: [
    "",
    "<white>Open Source Projects</white>",
    [
      [
        "jQuery Terminal",
        "https://terminal.jcubic.pl",
        "library that adds terminal interface to websites",
      ],
      [
        "LIPS Scheme",
        "https://lips.js.org",
        "Scheme implementation in JavaScript",
      ],
      ["Sysend.js", "https://jcu.bi/sysend", "Communication between open tabs"],
      ["Wayne", "https://jcu.bi/wayne", "Pure in browser HTTP requests"],
    ].map(([name, url, description = ""]) => {
      return `*<a href="${url}">${name}</a> &mdash; <white>${description}</white>`;
    }),
    "",
  ].flat(),
  skills: [
    "",
    "<white>languages</white>",
    ["Javascript", "Typescript", "Python", "SQL", "PHP", "Bash"].map(
      (lang) => `* <yellow>${lang}</yellow>`
    ),
    "",
    "<white>libraries</white>",
    ["React.js", "Redux", "Jest"].map((lib) => `* <green>${lib}</green>`),
    "",
    "<white>tools</white>",
    ["Docker", "git", "GNU/Linux"].map((tool) => `* <blue>${tool}</blue>`),
    "",
  ].flat(),
};

const dirs = Object.keys(directories);

const commands = {
  help() {
    terminal.echo(`List of available commands: ${help}`);
  },
  echo(...args) {
    if (args.length > 0) {
      terminal.echo(args.join(" "));
    }
  },
  cd(dir = null) {
    if (dir === null || (dir === ".." && cwd !== root)) {
      cwd = root;
    } else if (dir.startsWith("~/") && dir.includes(dir.substring(2))) {
      cwd = dir;
    } else if (dir.includes(dir)) {
      cwd = root + "/" + dir;
    } else {
      this.error("Wrong directory");
    }
  },
  ls(dir = null) {
    if (dir) {
      if (dir.startsWith("~/")) {
        const path = dir.substring(2);
        const dirs = path.split("/");
        if (dirs.length > 1) {
          this.error("Invalid directory");
        } else {
          const dir = dirs[0];
          this.echo(directories[dir].join("\n"));
        }
      } else if (cwd === root) {
        if (dir in directories) {
          this.echo(directories[dir].join("\n"));
        } else {
          this.error("Invalid directory");
        }
      } else if (dir === "..") {
        printDirs();
      } else {
        this.error("Invalid directory");
      }
    } else if (cwd === root) {
      printDirs();
    } else {
      const dir = cwd.substring(2);
      this.echo(directories[dir].join("\n"));
    }
  },
  async joke() {
    const res = await fetch("https://v2.jokeapi.dev/joke/Any?type=single");
    const data = await res.json();
    if (data.type == "twopart") {
      this.echo(`Q: ${data.setup}`);
      this.echo(`A: ${data.delivery}`);
    } else if (data.type == "single") {
      this.echo(data.joke, { delay: 50, typing: true });
    }
  },
  credits() {
    return [
      "",
      "<white>Used libraries:</white>",
      '* <a href="https://terminal.jcubic.pl">jQuery Terminal</a>',
      '* <a href="https://github.com/patorjk/figlet.js/">Figlet.js</a>',
      '* <a href="https://github.com/jcubic/isomorphic-lolcat">Isomorphic Lolcat</a>',
      '* <a href="https://jokeapi.dev/">Joke API</a>',
      "",
    ].join("\n");
  },
};

const formatter = new Intl.ListFormat("en", {
  style: "long",
  type: "conjunction",
});
const commandList = ["clear"].concat(Object.keys(commands));
const formattedList = commandList.map((cmd) => {
  return `<white class="command">${cmd}</white>`;
});
const help = formatter.format(formattedList);

function printDirs() {
  terminal.echo(
    dirs.map((dir) => `<blue class="directory">${dir}</blue>`).join("\n")
  );
}

export default commands;
export { cwd };
