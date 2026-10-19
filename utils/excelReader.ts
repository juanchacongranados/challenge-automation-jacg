import ExcelJS from "exceljs";
import path from "node:path";

export interface PokemonTestData {
  id: number;
  name: string;
  abilities: string[];
}

export async function readPokemonTestData(): Promise<PokemonTestData[]> {
  const filePath = path.resolve(
    process.cwd(),
    "test-data",
    "Datos-pruebas.xlsx",
  );

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const worksheet = workbook.getWorksheet("GET pokemon");

  if (!worksheet) {
    throw new Error('Worksheet "GET pokemon" not found');
  }

  const testData: PokemonTestData[] = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    const id = Number(row.getCell(1).value);
    const name = String(row.getCell(2).value ?? "").trim();

    const abilities = String(row.getCell(3).value ?? "")
      .split(",")
      .map((ability) => ability.trim())
      .filter(Boolean);

    if (!Number.isInteger(id) || id <= 0 || !name || abilities.length === 0) {
      throw new Error(`Invalid test data at Excel row ${rowNumber}`);
    }

    testData.push({ id, name, abilities });
  });

  return testData;
}
