const path = require('path')
const normalizePackageData = require('normalize-package-data');
const fs = require("fs/promises");
const generateMetadata = require('./generate-metadata-for-builder')

// Monkey-patch to not remove things I explicitly didn't say so
// See: https://github.com/electron-userland/electron-builder/issues/6957
let transformer = require('app-builder-lib/out/fileTransformer')
const builder_util_1 = require("builder-util");

transformer.createTransformer = function(srcDir, configuration, extraMetadata, extraTransformer) {
    const mainPackageJson = path.join(srcDir, "package.json");
    const isRemovePackageScripts = configuration.removePackageScripts !== false;
    const isRemovePackageKeywords = configuration.removePackageKeywords !== false;
    const packageJson = path.sep + "package.json";
    return file => {
        if (file === mainPackageJson) {
            return modifyMainPackageJson(file, extraMetadata, isRemovePackageScripts, isRemovePackageKeywords);
        }
        if (extraTransformer != null) {
            return extraTransformer(file);
        }
        else {
            return null;
        }
    };
}
async function modifyMainPackageJson(file, extraMetadata, isRemovePackageScripts, isRemovePackageKeywords) {
    const mainPackageData = JSON.parse(await fs.readFile(file, "utf-8"));
    if (extraMetadata != null) {
        builder_util_1.deepAssign(mainPackageData, extraMetadata);
        return JSON.stringify(mainPackageData, null, 2);
    }
    return null;
}
/// END Monkey-Patch

const builder = require("electron-builder")
const Platform = builder.Platform


const pngIcon = 'resources/app-icons/beta.png'
const icoIcon = 'resources/app-icons/beta.ico'

let options = {
  "appId": "com.pulsar-edit.pulsar",
  "npmRebuild": false,
  "publish": null,
  files: [
    "package.json",
    "!docs/",
    "dot-atom/**/*",
    "exports/**/*",
    "!keymaps/",
    "!menus/",
    "node_modules/**/*",
    "resources/**/*",
    "!script/",
    "src/**/*",
    "static/**/*",
    "vendor/**/*",
    "!**/node_modules/*/{test,__tests__,tests,powered-test,example,examples}",
    "!**/node_modules/*.d.ts",
    "!**/node_modules/.bin",
    "!**/*.{iml,o,hprof,orig,pyc,pyo,rbc,swp,csproj,sln,xproj}",
    "!.editorconfig",
    "!**/._*",
    "!**/{.DS_Store,.git,.hg,.svn,CVS,RCS,SCCS,.gitignore,.gitattributes}",
    "!**/{__pycache__,thumbs.db,.flowconfig,.idea,.vs,.nyc_output}",
    "!**/{appveyor.yml,.travis.yml,circle.yml}",
    "!**/{npm-debug.log,yarn.lock,.yarn-integrity,.yarn-metadata.json}",

    "spec/jasmine-test-runner.js",
    "spec/spec-helper.js",
    "spec/jasmine-junit-reporter.js",
    "spec/spec-helper-functions.js",
    "spec/atom-reporter.js",
    "spec/jasmine-list-reporter.js",

    // The following are taken directly from Atom (Hoping they still apply)
    "!**/{.jshintrc,.npmignore,.pairs,.lint,.lintignore,.eslintrc,.jshintignore}",
    "!**/{.coffeelintignore,.git-keep}",
    "!**/git-utils/deps",
    "!**/oniguruma/deps",
    "!**/less/dist",
    "!**/npm/{doc,html,man}",
    "!**/pegjs/examples",
    "!**/get-parameter-names/node_modules/testla",
    "!**/get-parameter-names/node_modules/.bin/testla",
    "!**/jasmine-reporters/ext",
    "!**/node_modules/native-mate",
    "!**/build/{binding.Makefile,config.gypi,gyp-mac-tool,Makefile}",
    "!**/build/Release/{obj.target,obj,.deps}",
    "!**/deps/libgit2",
    "!**/node_modules/spellchecker/vendor/hunspell/.*",
    // These are only required in dev-mode, when pegjs grammars aren't precompiled
    "!node_modules/loophole",
    "!node_modules/pegjs",
    "!node_modules/.bin/pegjs",
    // node_modules of the fuzzy-native package are only required for building it
    "!node_modules/fuzzy-native/node_modules",
    // Ignore *.cc and *.h files from native modules
    "!**/*.{cc,h}",
    // Handpicked spec folders
    "!**/{oniguruma,dev-live-reload,deprecation-cop,one-dark-ui,incompatible-packages,git-diff,line-ending-selector}/spec",
    "!**/{link,grammar-selector,json-schema-traverse,exception-reporting,one-light-ui,autoflow,about,go-to-line,sylvester,apparatus}/spec",
    // Ignore babel-core spec
    "!**/node_modules/babel-core/lib/transformation/transforers/spec",

    // The following are cherry-picked for Pulsar
    "!**/{archive-view,autocomplete-plus,autocomplete-atom-api,autocomplete-css,autosave}/spec",
    "!**/{.eslintignore,PULL_REQUEST_TEMPLATE.md,ISSUE_TEMPLATE.md,CONTRIBUTING.md,SECURITY.md}",
    "!**/{Makefile,.editorconfig,.nycrc,.coffeelint.json,.github,.vscode,coffeelint.json}",
    "!**/*.js.map",
  ],
  "extraResources": [
    {
      "from": "pulsar.sh",
      "to": "pulsar.sh"
    }, {
      "from": "ppm",
      "to": "app/ppm"
    }, {
      "from": pngIcon,
      "to": "pulsar.png"
    },
  ],
  compression: "normal",
  deb: { afterInstall: "script/post-install.sh" },
  rpm: {
    afterInstall: "script/post-install.sh",
    compression: 'xz'
  },
  "linux": {
    "icon": pngIcon,
    "category": "Development",
    "synopsis": "A Community-led Hyper-Hackable Text Editor",
    "target": [
      { target: "appimage" },
      { target: "deb" },
      { target: "rpm" },
      { target: "tar.gz" }
    ],
  },
  "mac": {
    "icon": pngIcon,
    "category": "Development"
  },
  "win": {
    "icon": icoIcon,
    "target": [
      { "target": "nsis" },
      { "target": "portable" }
    ]
  },
  "extraMetadata": {
  },
  "asarUnpack": [
    "node_modules/github/bin/*",
    "node_modules/github/lib/*", // Resolves Error in console
    "**/node_modules/dugite/git/**", // Include dugite postInstall output (matching glob used for Atom)
    "**/node_modules/spellchecker/**", // Matching Atom Glob
  ]

}

function whatToBuild() {
  const argvStartingWith = process.argv.findIndex(e => e.match('electron-builder.js'))
  const what = process.argv[argvStartingWith + 1]
  if(what) {
    const filter = e => e.target === what
    options.linux.target = options.linux.target.filter(filter)
    options.win.target = options.win.target.filter(filter)
    // options.mac.target = options.mac.target.filter(filter)
    return options
  } else {
    return options
  }
}

async function main() {
  const package = await fs.readFile('package.json', "utf-8")
  let options = whatToBuild()
  options.extraMetadata = generateMetadata(JSON.parse(package))
  builder.build({
    //targets: Platform.LINUX.createTarget(),
    config: options
  }).then((result) => {
    console.log("Built binaries")
    fs.mkdir('binaries').catch(() => "")
    Promise.all(result.map(r => fs.copyFile(r, path.join('binaries', path.basename(r)))))
  }).catch((error) => {
    console.error("Error building binaries")
    console.error(error)
    process.exit(1)
  })
}

main()
