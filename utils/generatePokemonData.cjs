const ExcelJS = require("exceljs");
const fs = require("node:fs");
const path = require("node:path");

async function main() {
  const workbook = new ExcelJS.Workbook();

  await workbook.xlsx.readFile(path.resolve("test-data/Datos-pruebas.xlsx"));

  const worksheet = workbook.getWorksheet("GET pokemon");

  if (!worksheet) {
    throw new Error('Worksheet "GET pokemon" not found');
  }

  const pokemonData = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    const id = Number(row.getCell(1).value);
    const name = String(row.getCell(2).value ?? "").trim();
    const abilities = String(row.getCell(3).value ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    if (!Number.isInteger(id) || id <= 0 || !name || !abilities.length) {
      throw new Error(`Invalid data at Excel row ${rowNumber}`);
    }

    pokemonData.push({ id, name, abilities });
  });

  fs.writeFileSync(
    path.resolve("test-data/pokemon.generated.json"),
    JSON.stringify(pokemonData, null, 2),
  );

  console.log(`Generated ${pokemonData.length} Pokemon records.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
