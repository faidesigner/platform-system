const fs = require("fs");
const path = require("path");

const rootDir = process.cwd();
const productArg = process.argv[2];

if (!productArg) {
  console.error("Usage: pnpm link-ui <product-folder-or-package-name>");
  process.exit(1);
}

const productsDir = path.join(rootDir, "products");
const uiPackage = "@fai/ui";

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

function findProduct() {
  const directPath = path.join(productsDir, productArg, "package.json");

  if (fs.existsSync(directPath)) {
    return {
      dir: path.dirname(directPath),
      packageJsonPath: directPath,
      packageJson: readJson(directPath),
    };
  }

  const entries = fs.existsSync(productsDir) ? fs.readdirSync(productsDir, { withFileTypes: true }) : [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const packageJsonPath = path.join(productsDir, entry.name, "package.json");
    if (!fs.existsSync(packageJsonPath)) continue;

    const packageJson = readJson(packageJsonPath);
    if (packageJson.name === productArg) {
      return {
        dir: path.dirname(packageJsonPath),
        packageJsonPath,
        packageJson,
      };
    }
  }

  return null;
}

function linkPackageDependency(product) {
  product.packageJson.dependencies = product.packageJson.dependencies || {};

  if (product.packageJson.dependencies[uiPackage] === "workspace:*") {
    return false;
  }

  product.packageJson.dependencies[uiPackage] = "workspace:*";
  writeJson(product.packageJsonPath, product.packageJson);
  return true;
}

function ensureNextTranspile(product) {
  const nextConfigPath = path.join(product.dir, "next.config.ts");
  if (!fs.existsSync(nextConfigPath)) {
    return { changed: false, message: "next.config.ts not found; skipped Next transpile config." };
  }

  const source = fs.readFileSync(nextConfigPath, "utf8");
  if (source.includes(uiPackage)) {
    return { changed: false, message: "next.config.ts already references @fai/ui." };
  }

  const transpileMatch = source.match(/transpilePackages\s*:\s*\[([^\]]*)\]/m);
  if (transpileMatch) {
    const replacement = `transpilePackages: [${transpileMatch[1].trim() ? `${transpileMatch[1].trim()}, ` : ""}"${uiPackage}"]`;
    fs.writeFileSync(nextConfigPath, source.replace(transpileMatch[0], replacement));
    return { changed: true, message: "Added @fai/ui to existing transpilePackages." };
  }

  const configObjectMatch = source.match(/(const\s+nextConfig(?:\s*:\s*[^=]+)?\s*=\s*\{)/);
  if (!configObjectMatch) {
    return {
      changed: false,
      message: "Could not find nextConfig object; add transpilePackages manually.",
    };
  }

  const nextSource = source.replace(configObjectMatch[1], `${configObjectMatch[1]}\n  transpilePackages: ["${uiPackage}"],`);
  fs.writeFileSync(nextConfigPath, nextSource);
  return { changed: true, message: "Added transpilePackages to next.config.ts." };
}

const product = findProduct();

if (!product) {
  console.error(`Product not found: ${productArg}`);
  console.error("Pass a folder under products/ or a package.json name.");
  process.exit(1);
}

const dependencyChanged = linkPackageDependency(product);
const nextConfigResult = ensureNextTranspile(product);

console.log(`Linked ${uiPackage} to ${product.packageJson.name || path.basename(product.dir)}`);
console.log(dependencyChanged ? "Updated package.json dependency." : "package.json dependency already exists.");
console.log(nextConfigResult.message);
