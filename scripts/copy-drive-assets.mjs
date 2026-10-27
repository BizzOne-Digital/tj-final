import fs from "fs";
import path from "path";

const root = path.join(process.cwd(), "public", "Main Page -20261009T164029Z-1-001", "Main Page");
const out = path.join(process.cwd(), "public", "league-assets");
const docsOut = path.join(process.cwd(), "public", "league-docs");

const copies = [
  ["__program_poster__", "main/program-picture.jpg"],
  ["__grades_56_poster__", "divisions/grades-5-6.jpg"],
  ["INFORMATION/3-4 GRADE LEAGUE POSTER/grades-3-4.jpg", "divisions/grades-3-4.jpg"],
  ["Main Page Heading/Pictures/IMG_0757.JPG", "main/heading-gallery.jpg"],
  ["ABOUT US/EE5CAF73-5DAA-47A1-99A9-B4033902B190.PNG", "about/about-feature.png"],
  ["GOLDEN TICKET/907B921F-DF05-428D-B498-781E1BC71B83.PNG", "golden-ticket/picture.png"],
  ["TYRONE/3BE5C695-8356-48BB-9B3C-C3CE74112C6B.PNG", "schools/tyrone/team.png"],
  ["__tyrone_56_schedule__", "schools/tyrone/schedule.jpg"],
  ["CLEARFIELD/AF1993F2-7E78-431E-A2EC-BDF1F3BD6EB6.PNG", "schools/clearfield/team.png"],
  ["__clearfield_56_schedule__", "schools/clearfield/schedule.jpg"],
  ["BELLWOOD/CDD48F70-9FD5-4AE0-83F1-3EDB4A613FDD.PNG", "schools/bellwood-antis/team.png"],
  ["BELLWOOD/Schedule/E3CF84D6-FF4E-488A-8536-4B8A2AC211ED.PNG", "schools/bellwood-antis/schedule.png"],
  // 3/4 grade poster — committed under league-assets when not in Drive export
  ["__bellwood_34__", "schools/bellwood-antis/schedule-grades-3-4.jpg"],
  ["__bellwood_56__", "schools/bellwood-antis/schedule-grades-5-6.jpg"],
  ["__bellwood_56_blue__", "schools/bellwood-antis/schedule-grades-5-6-blue.jpg"],
  ["PHILIPSBURG-OSCEOLA/IMG_0786.PNG", "schools/philipsburg-osceola/team.png"],
  ["__po_3_schedule__", "schools/philipsburg-osceola/schedule-grades-3.jpg"],
  ["__po_4_schedule__", "schools/philipsburg-osceola/schedule-grades-4.jpg"],
  ["__po_56_schedule__", "schools/philipsburg-osceola/schedule-grades-5-6.jpg"],
  ["MO VALLEY/IMG_0784.PNG", "schools/moshannon-valley/team.png"],
  ["__mo_valley_34_schedule__", "schools/moshannon-valley/schedule-1.jpg"],
  ["__mo_valley_56_schedule__", "schools/moshannon-valley/schedule-2.jpg"],
  ["WEST BRANCH/IMG_0785.PNG", "schools/west-branch/team.png"],
  ["MIFFLIN COUNTY/team.jpg", "schools/mifflin-county/team.jpg"],
  ["__mifflin_huskies_schedule__", "schools/mifflin-county/schedule-huskies.jpg"],
  ["__mifflin_purple_schedule__", "schools/mifflin-county/schedule-4th-grade-purple.jpg"],
  ["__west_branch_4th_schedule__", "schools/west-branch/schedule-1.jpg"],
  ["__west_branch_56_schedule__", "schools/west-branch/schedule-2.jpg"],
  ["__league_34_schedule__", "information/4th-grade-team-schedules.jpg"],
  ["__league_56_schedule__", "information/6th-grade-team-schedules.jpg"],
  ["INFORMATION/CENTRAL PA LIONS/Pictures/IMG_0074.jpg", "central-pa-lions/1.jpg"],
  ["INFORMATION/CENTRAL PA LIONS/Pictures/IMG_0076.jpg", "central-pa-lions/2.jpg"],
  ["INFORMATION/CENTRAL PA LIONS/Pictures/IMG_0077.jpg", "central-pa-lions/3.jpg"],
];

const poster = path.join(process.cwd(), "public", "brand", "season-poster-2026-27.jpg");
if (fs.existsSync(poster)) {
  copies.push(["__poster__", "main/nike-from-poster.jpg"]);
}

function normalizeFolderName(name) {
  return name
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/[^\w\s/-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/** Map normalized INFORMATION folder names → site resource slug */
const folderToSlug = [
  ["by-laws", "by-laws"],
  ["2026 league roster form", "2026-league-roster"],
  ["2026 league roster", "2026-league-roster"],
  ["player s code of conduct form", "players-code-of-conduct"],
  ["players code of conduct form", "players-code-of-conduct"],
  ["parent guardian code of conduct", "parent-guardian-code-of-conduct"],
  ["public relations internet and photo release form", "photo-release"],
  ["zerotolerance photography & recording policy", "zero-tolerance-photography"],
  ["zerotolerance photography recording policy", "zero-tolerance-photography"],
  ["zero tolerance photography & recording policy", "zero-tolerance-photography"],
  ["zero tolerance photography recording policy", "zero-tolerance-photography"],
  ["injury report form", "injury-report"],
  ["all-star selection form", "all-star-selection"],
  ["player of the game weekly voting form", "player-of-the-game-voting"],
  ["contacts for next season form", "contacts-for-next-season"],
  ["game officials feedback form", "game-officials-feedback"],
  ["how can we be better", "how-can-we-be-better"],
  ["formal complaint process", "formal-complaint-process"],
];

function slugForInfoFolder(folderName) {
  const n = normalizeFolderName(folderName);
  for (const [needle, slug] of folderToSlug) {
    if (n.includes(needle) || needle.includes(n)) return slug;
  }
  return null;
}

function walkFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkFiles(p, acc);
    else acc.push(p);
  }
  return acc;
}

const docManifest = {};

function slugFromFilename(base) {
  const b = base.toLowerCase();
  if (b.includes("student_athlete_code") || b.includes("code_of_conduct")) return "players-code-of-conduct";
  if (b.includes("parent") && b.includes("conduct")) return "parent-guardian-code-of-conduct";
  if (b.includes("zero") && b.includes("tolerance")) return "zero-tolerance-photography";
  if (b.includes("roster")) return "2026-league-roster";
  if (b.includes("all_star") && !b.includes("voting")) return "all-star-selection";
  if (b.includes("player_of_the_game")) return "player-of-the-game-voting";
  if (b.includes("photo_release") || b.includes("public_relations")) return "photo-release";
  if (b.includes("injury")) return "injury-report";
  if (b.includes("officials_feedback")) return "game-officials-feedback";
  if (b.includes("how_can_we_be_better")) return "how-can-we-be-better";
  if (b.includes("formal_complaint")) return "formal-complaint-process";
  if (b.includes("contacts_for_next")) return "contacts-for-next-season";
  if (b.includes("bylaws")) return "by-laws";
  return null;
}

function copyDocs() {
  const infoRoot = path.join(root, "INFORMATION");
  if (!fs.existsSync(infoRoot)) return;
  fs.mkdirSync(docsOut, { recursive: true });

  for (const ent of fs.readdirSync(infoRoot, { withFileTypes: true })) {
    if (!ent.isDirectory()) continue;
    const folder = path.join(infoRoot, ent.name);
    const docs = walkFiles(folder).filter((f) => /\.(docx|pdf|png|jpe?g)$/i.test(f));
    if (!docs.length) continue;
    const folderSlug = slugForInfoFolder(ent.name);
    let slug = folderSlug;
    if (!slug) {
      for (const f of docs) {
        const fromName = slugFromFilename(path.basename(f, path.extname(f)));
        if (fromName) {
          slug = fromName;
          break;
        }
      }
    }
    if (!slug) continue;
    const preferred =
      docs.find((f) => {
        const s = slugFromFilename(path.basename(f, path.extname(f)));
        return s === slug;
      }) ??
      docs.find((f) => !/voting/i.test(path.basename(f))) ??
      docs[0];
    const ext = path.extname(preferred).toLowerCase();
    const destRel = `${slug}${ext}`;
    const dest = path.join(docsOut, destRel);
    fs.copyFileSync(preferred, dest);
    docManifest[slug] = `/league-docs/${destRel}`;
    console.log("DOC", slug, destRel);
  }
}

for (const [rel, destRel] of copies) {
  const dest = path.join(out, destRel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (rel === "__poster__") {
    fs.copyFileSync(poster, dest);
    continue;
  }
  if (
    rel === "__program_poster__" ||
    rel === "__grades_56_poster__" ||
    rel === "__bellwood_34__" ||
    rel === "__bellwood_56__" ||
    rel === "__bellwood_56_blue__" ||
    rel === "__tyrone_56_schedule__" ||
    rel === "__clearfield_56_schedule__" ||
    rel === "__po_3_schedule__" ||
    rel === "__po_4_schedule__" ||
    rel === "__po_56_schedule__" ||
    rel === "__mo_valley_56_schedule__" ||
    rel === "__west_branch_56_schedule__" ||
    rel === "__league_34_schedule__" ||
    rel === "__league_56_schedule__" ||
    rel === "__mifflin_huskies_schedule__" ||
    rel === "__mifflin_purple_schedule__" ||
    rel === "__mo_valley_34_schedule__" ||
    rel === "__west_branch_4th_schedule__"
  ) {
    if (!fs.existsSync(dest)) {
      console.warn("Skip (already in repo):", destRel);
      continue;
    }
    console.log("OK (existing)", destRel);
    continue;
  }
  const src = path.join(root, rel);
  if (!fs.existsSync(src)) {
    console.warn("Missing:", src);
    continue;
  }
  fs.copyFileSync(src, dest);
  console.log("OK", destRel);
}

copyDocs();

const manifest = {};
for (const [, destRel] of copies) {
  const key = destRel.replace(/\.[^.]+$/, "").replace(/\//g, ".");
  manifest[key] = `/league-assets/${destRel.replace(/\\/g, "/")}`;
}

fs.writeFileSync(
  path.join(process.cwd(), "src", "lib", "drive-assets.manifest.json"),
  JSON.stringify(manifest, null, 2),
);
fs.writeFileSync(
  path.join(process.cwd(), "src", "lib", "league-docs.manifest.json"),
  JSON.stringify(docManifest, null, 2),
);
console.log("Manifests written.", Object.keys(manifest).length, "images", Object.keys(docManifest).length, "docs");
