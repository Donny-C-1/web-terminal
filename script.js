import commands from "./commands.js";
import { cwd } from "./commands.js";

const font = "Slant";

figlet.defaults({ fontPath: "https://unpkg.com/figlet/fonts/" });
figlet.preloadFonts([font], ready);

const user = "guest";
const server = "freecodecamp.org";

$.terminal.xml_formatter.tags.green = (attrs) => `[[;#44D544;]`;
$.terminal.xml_formatter.tags.blue = (attrs) => `[[;#55F;;${attrs.class}]`;

function prompt() {
  return `<green>${user}@${server}</green>:<blue>${cwd}</blue>$`;
}

let terminal = $("body").terminal(commands, {
  greetings: false,
  checkArity: false,
  completion(string) {
    const cmd = this.get_command();
    const { name, rest } = $.terminal.parse_command(cmd);
    if (["cd", "ls"].includes(name)) {
      if (rest.startsWith("~/")) {
        return dirs.map((dir) => `~/${dir}`);
      }
      if (cwd === root) {
        return dirs;
      }
    }
    return Object.keys(commands);
  },
  prompt,
});

terminal.on("click", ".command", function () {
  const command = $(this).text();
  terminal.exec(command);
});

terminal.on("click", ".directory", function () {
  const dir = $(this).text();
  terminal.exec(`cd ~/${dir}`);
});

const re = new RegExp(
  `^\s*(${["clear"].concat(Object.keys(commands)).join("|")})(.*)`
);

$.terminal.new_formatter(function (string) {
  return string.replace(re, function (_, command, args) {
    return `<white>${command}</white> <aqua>${args}</aqua>`;
  });
});

function ready() {
  terminal
    .echo(() => rainbow(render("Terminal Portfolio")))
    .echo("Welcome to my Terminal Portfolio");
}

function render(text) {
  const cols = terminal.cols();
  return figlet.textSync(text, {
    font: font,
    width: cols,
    whitespaceBreak: true,
  });
}

// To add color
// Use formating
// echo [[<style>;<colour>;<bgColour>;]String]

function rainbow(string) {
  return lolcat
    .rainbow(function (char, color) {
      char = $.terminal.escape_brackets(char);
      return `[[;${hex(color)};]${char}]`;
    }, string)
    .join("\n");
}

function hex(color) {
  return (
    "#" +
    [color.red, color.green, color.blue]
      .map((n) => n.toString(16).padStart(2, "0"))
      .join("")
  );
}

export default terminal;
