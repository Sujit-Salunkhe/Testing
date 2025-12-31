import "@glideapps/glide-data-grid/dist/index.css";
import { DataEditor, CompactSelection } from "@glideapps/glide-data-grid";
import type {
  GridCell,
  GridColumn,
  Item,
  GridSelection,
} from "@glideapps/glide-data-grid";
import { useState, useCallback, useMemo, useEffect } from "react";

const data = [
  // Row 0 – header
  [
    "",
    "",
    "",
    "Q1 2015",
    "Q2 2015",
    "Q3 2015",
    "Q4 2015",
    "Q1 2016",
    "Q2 2016",
    "Q3 2016",
    "Q4 2016",
    "Q1 2017",
    "Q2 2017",
    "Q3 2017",
    "Q4 2017",
    "Q1 2018",
    "Q2 2018",
    "Q3 2018",
    "Q4 2018",
    "FY 2018",
  ],

  // Revenue block
  [
    "Revenue",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ],
  [
    "Product Revenue",
    "SAM MP",
    "SAM MP",
    "25,334",
    "26,789",
    "27,456",
    "28,123",
    "29,001",
    "29,876",
    "30,455",
    "31,022",
    "31,678",
    "32,245",
    "32,889",
    "33,455",
    "34,012",
    "34,578",
    "35,134",
    "35,689",
    "473,946",
  ],
  [
    "Service Revenue",
    "SAM MP",
    "SAM MP",
    "5,123",
    "5,456",
    "5,789",
    "6,012",
    "6,234",
    "6,456",
    "6,678",
    "6,890",
    "7,012",
    "7,145",
    "7,278",
    "7,412",
    "7,545",
    "7,678",
    "7,812",
    "7,945",
    "98,275",
  ],
  [
    "Other Revenue",
    "SAM MP",
    "SAM MP",
    "1,234",
    "1,278",
    "1,322",
    "1,366",
    "1,410",
    "1,454",
    "1,498",
    "1,542",
    "1,586",
    "1,630",
    "1,674",
    "1,718",
    "1,762",
    "1,806",
    "1,850",
    "1,894",
    "23,774",
  ],
  [
    "Total Revenue",
    "",
    "",
    "31,691",
    "33,523",
    "34,567",
    "35,501",
    "36,645",
    "37,786",
    "38,631",
    "39,454",
    "40,276",
    "41,020",
    "41,841",
    "42,585",
    "43,319",
    "44,062",
    "44,796",
    "45,528",
    "595,995",
  ],

  [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ],

  // Cost / Gross Profit
  [
    "Cost of Revenue",
    "SAM MP",
    "SAM MP",
    "18,234",
    "19,345",
    "19,876",
    "20,456",
    "21,034",
    "21,567",
    "22,045",
    "22,534",
    "23,012",
    "23,456",
    "23,934",
    "24,378",
    "24,856",
    "25,345",
    "25,789",
    "26,245",
    "325,316",
  ],
  [
    "Gross Profit",
    "",
    "",
    "13,457",
    "14,178",
    "14,691",
    "15,045",
    "15,611",
    "16,219",
    "16,586",
    "16,920",
    "17,264",
    "17,564",
    "17,907",
    "18,207",
    "18,463",
    "18,717",
    "19,007",
    "19,283",
    "270,684",
  ],
  [
    "Gross Margin %",
    "",
    "",
    "42.4%",
    "42.3%",
    "42.5%",
    "42.4%",
    "42.6%",
    "42.9%",
    "43.0%",
    "42.9%",
    "42.9%",
    "42.8%",
    "42.8%",
    "42.7%",
    "42.6%",
    "42.5%",
    "42.5%",
    "42.3%",
    "42.6%",
  ],

  [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ],

  // Operating expenses
  [
    "Research & Development",
    "SAM MP",
    "SAM MP",
    "3,456",
    "3,567",
    "3,678",
    "3,789",
    "3,901",
    "4,012",
    "4,123",
    "4,234",
    "4,345",
    "4,456",
    "4,567",
    "4,678",
    "4,789",
    "4,890",
    "5,001",
    "5,112",
    "64,140",
  ],
  [
    "Sales & Marketing",
    "SAM MP",
    "SAM MP",
    "2,345",
    "2,456",
    "2,567",
    "2,678",
    "2,789",
    "2,890",
    "2,990",
    "3,090",
    "3,190",
    "3,290",
    "3,390",
    "3,490",
    "3,590",
    "3,690",
    "3,790",
    "3,890",
    "50,135",
  ],
  [
    "General & Administrative",
    "SAM MP",
    "SAM MP",
    "1,234",
    "1,345",
    "1,456",
    "1,567",
    "1,678",
    "1,789",
    "1,890",
    "1,990",
    "2,090",
    "2,190",
    "2,290",
    "2,390",
    "2,490",
    "2,590",
    "2,690",
    "2,790",
    "32,028",
  ],
  [
    "Total Operating Expenses",
    "",
    "",
    "7,035",
    "7,368",
    "7,701",
    "8,034",
    "8,368",
    "8,691",
    "9,003",
    "9,314",
    "9,625",
    "9,936",
    "10,247",
    "10,558",
    "10,869",
    "11,170",
    "11,481",
    "11,792",
    "146,303",
  ],

  [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ],

  // Operating income
  [
    "Operating Income",
    "",
    "",
    "6,422",
    "6,810",
    "6,990",
    "7,011",
    "7,243",
    "7,528",
    "7,583",
    "7,606",
    "7,639",
    "7,628",
    "7,660",
    "7,649",
    "7,594",
    "7,547",
    "7,526",
    "7,491",
    "124,381",
  ],
  [
    "Operating Margin %",
    "",
    "",
    "20.3%",
    "20.3%",
    "20.2%",
    "19.8%",
    "19.8%",
    "19.9%",
    "19.6%",
    "19.3%",
    "19.0%",
    "18.6%",
    "18.3%",
    "18.0%",
    "17.5%",
    "17.1%",
    "16.8%",
    "16.4%",
    "18.0%",
  ],
  [
    "Depreciation & Amortization",
    "EPS Excluded",
    "EPS Excluded",
    "1,234",
    "1,256",
    "1,278",
    "1,300",
    "1,322",
    "1,344",
    "1,366",
    "1,388",
    "1,410",
    "1,432",
    "1,454",
    "1,476",
    "1,498",
    "1,520",
    "1,542",
    "1,564",
    "19,164",
  ],
  [
    "EBITDA",
    "EPS Excluded",
    "EPS Excluded",
    "7,656",
    "8,066",
    "8,268",
    "8,311",
    "8,565",
    "8,872",
    "8,949",
    "8,994",
    "9,049",
    "9,060",
    "9,114",
    "9,125",
    "9,092",
    "9,067",
    "9,068",
    "9,055",
    "143,545",
  ],

  [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ],

  // Financial metrics
  [
    "Interest Income",
    "",
    "",
    "504",
    "512",
    "518",
    "525",
    "531",
    "538",
    "545",
    "552",
    "559",
    "566",
    "573",
    "580",
    "587",
    "594",
    "601",
    "608",
    "8,295",
  ],
  [
    "Interest Expense",
    "",
    "",
    "-268",
    "-272",
    "-276",
    "-280",
    "-284",
    "-288",
    "-292",
    "-296",
    "-300",
    "-304",
    "-308",
    "-312",
    "-316",
    "-320",
    "-324",
    "-328",
    "-4,636",
  ],
  [
    "Other Income/(Expense)",
    "",
    "",
    "101",
    "103",
    "104",
    "106",
    "108",
    "109",
    "111",
    "112",
    "114",
    "116",
    "117",
    "119",
    "121",
    "122",
    "124",
    "125",
    "1,712",
  ],
  [
    "Income Before Tax",
    "",
    "",
    "6,759",
    "7,149",
    "7,334",
    "7,362",
    "7,598",
    "7,957",
    "8,003",
    "8,016",
    "8,072",
    "8,074",
    "8,106",
    "8,109",
    "8,072",
    "8,041",
    "8,045",
    "8,032",
    "129,756",
  ],
  [
    "Income Tax Expense",
    "",
    "",
    "1,687",
    "1,783",
    "1,833",
    "1,841",
    "1,899",
    "1,989",
    "2,001",
    "2,004",
    "2,018",
    "2,018",
    "2,027",
    "2,028",
    "2,018",
    "2,010",
    "2,011",
    "2,008",
    "32,154",
  ],
  [
    "Net Income",
    "",
    "",
    "5,072",
    "5,366",
    "5,501",
    "5,521",
    "5,699",
    "5,968",
    "6,002",
    "6,012",
    "6,054",
    "6,056",
    "6,079",
    "6,081",
    "6,054",
    "6,031",
    "6,034",
    "6,024",
    "97,602",
  ],
  [
    "Net Margin %",
    "",
    "",
    "16.0%",
    "16.0%",
    "16.0%",
    "15.6%",
    "15.6%",
    "15.8%",
    "15.6%",
    "15.4%",
    "15.3%",
    "15.2%",
    "15.1%",
    "15.0%",
    "14.9%",
    "14.8%",
    "14.7%",
    "14.6%",
    "15.4%",
  ],
  [
    "Revenue YoY Growth %",
    "",
    "",
    "6.1%",
    "6.3%",
    "6.6%",
    "6.8%",
    "7.0%",
    "7.1%",
    "7.3%",
    "7.5%",
    "7.6%",
    "7.8%",
    "7.9%",
    "8.1%",
    "8.2%",
    "8.3%",
    "8.4%",
    "8.5%",
    "7.4%",
  ],
  [
    "Basic EPS",
    "",
    "",
    "1.75",
    "1.81",
    "1.88",
    "1.92",
    "1.98",
    "2.03",
    "2.08",
    "2.12",
    "2.17",
    "2.21",
    "2.25",
    "2.29",
    "2.33",
    "2.37",
    "2.41",
    "2.45",
    "32.04",
  ],
  [
    "Diluted EPS",
    "",
    "",
    "1.66",
    "1.72",
    "1.79",
    "1.83",
    "1.89",
    "1.94",
    "1.99",
    "2.03",
    "2.08",
    "2.12",
    "2.16",
    "2.20",
    "2.24",
    "2.28",
    "2.32",
    "2.36",
    "30.47",
  ],
  [
    "P/E Ratio",
    "",
    "",
    "26.2x",
    "27.0x",
    "27.8x",
    "28.4x",
    "29.0x",
    "29.6x",
    "30.2x",
    "30.8x",
    "31.3x",
    "31.8x",
    "32.2x",
    "32.7x",
    "33.1x",
    "33.5x",
    "33.9x",
    "34.3x",
    "30.2x",
  ],
  [
    "Market Cap",
    "",
    "",
    "253.5",
    "261.2",
    "268.9",
    "276.4",
    "283.8",
    "291.0",
    "298.1",
    "305.0",
    "311.8",
    "318.4",
    "324.9",
    "331.2",
    "337.4",
    "343.5",
    "349.5",
    "355.4",
    "4,615.4",
  ],
  [
    "Total Assets",
    "",
    "",
    "156.3",
    "163.4",
    "170.3",
    "182.3",
    "158.2",
    "175.5",
    "182.4",
    "187.1",
    "167.3",
    "172.9",
    "178.6",
    "184.2",
    "189.7",
    "195.1",
    "200.4",
    "205.6",
    "2,589.4",
  ],
  [
    "Current Assets",
    "",
    "",
    "77.8",
    "83.0",
    "84.9",
    "89.9",
    "83.3",
    "90.4",
    "90.2",
    "96.6",
    "90.8",
    "92.1",
    "93.4",
    "94.7",
    "96.0",
    "97.3",
    "98.6",
    "99.9",
    "1,259.9",
  ],
  [
    "Cash & Equivalents",
    "",
    "",
    "26.7",
    "28.4",
    "28.8",
    "30.0",
    "28.4",
    "30.3",
    "31.4",
    "33.3",
    "29.9",
    "30.5",
    "31.1",
    "31.7",
    "32.3",
    "32.9",
    "33.5",
    "34.1",
    "443.4",
  ],
  [
    "Short-term Investments",
    "",
    "",
    "29,311",
    "31,394",
    "33,053",
    "35,211",
    "31,297",
    "33,837",
    "33,995",
    "37,669",
    "33,818",
    "34,201",
    "34,583",
    "34,965",
    "35,347",
    "35,729",
    "36,111",
    "36,493",
    "497,975",
  ],
  [
    "Accounts Receivable",
    "",
    "",
    "17.5",
    "18.3",
    "18.8",
    "19.6",
    "18.0",
    "19.2",
    "20.6",
    "21.8",
    "19.2",
    "19.8",
    "20.4",
    "21.0",
    "21.6",
    "22.2",
    "22.8",
    "23.4",
    "307.6",
  ],
  [
    "Inventory",
    "",
    "",
    "3.9",
    "4.2",
    "4.4",
    "4.6",
    "4.1",
    "4.5",
    "4.6",
    "4.9",
    "4.4",
    "4.5",
    "4.6",
    "4.7",
    "4.8",
    "4.9",
    "5.0",
    "5.1",
    "66.3",
  ],
  [
    "Total Liabilities",
    "",
    "",
    "72.5",
    "78.3",
    "79.0",
    "86.7",
    "74.7",
    "80.9",
    "84.6",
    "91.1",
    "81.3",
    "83.7",
    "86.1",
    "88.5",
    "90.9",
    "93.3",
    "95.7",
    "98.1",
    "1,219.2",
  ],
  [
    "Current Liabilities",
    "",
    "",
    "38.2",
    "40.7",
    "44.0",
    "44.4",
    "40.0",
    "44.6",
    "46.2",
    "47.3",
    "43.9",
    "45.1",
    "46.3",
    "47.5",
    "48.7",
    "49.9",
    "51.1",
    "52.3",
    "700.0",
  ],
  [
    "Current Ratio",
    "",
    "",
    "1.89x",
    "1.95x",
    "2.05x",
    "2.15x",
    "1.98x",
    "2.02x",
    "2.16x",
    "2.26x",
    "2.06x",
    "2.04x",
    "2.02x",
    "1.99x",
    "1.97x",
    "1.95x",
    "1.93x",
    "1.91x",
    "2.02x",
  ],
  [
    "Long-term Debt",
    "",
    "",
    "26.4",
    "27.1",
    "29.2",
    "31.1",
    "27.8",
    "28.9",
    "30.7",
    "32.6",
    "29.4",
    "30.2",
    "31.0",
    "31.8",
    "32.6",
    "33.4",
    "34.2",
    "35.0",
    "449.4",
  ],
  [
    "Debt-to-Equity Ratio",
    "",
    "",
    "0.30x",
    "0.32x",
    "0.32x",
    "0.35x",
    "0.32x",
    "0.33x",
    "0.35x",
    "0.36x",
    "0.33x",
    "0.34x",
    "0.35x",
    "0.36x",
    "0.37x",
    "0.38x",
    "0.39x",
    "0.40x",
    "0.35x",
  ],
  [
    "Shareholders Equity",
    "",
    "",
    "79.5",
    "82.9",
    "90.4",
    "93.6",
    "83.2",
    "89.4",
    "93.0",
    "102.6",
    "91.8",
    "94.3",
    "96.8",
    "99.3",
    "101.8",
    "104.3",
    "106.8",
    "109.3",
    "1,374.2",
  ],
  [
    "ROE %",
    "",
    "",
    "11.5%",
    "12.8%",
    "12.9%",
    "13.3%",
    "12.6%",
    "13.1%",
    "13.4%",
    "14.6%",
    "13.6%",
    "13.9%",
    "14.1%",
    "14.3%",
    "14.5%",
    "14.7%",
    "14.9%",
    "15.1%",
    "13.8%",
  ],
  [
    "Stock Price",
    "",
    "",
    "48.6",
    "52.6",
    "51.9",
    "56.7",
    "52.6",
    "55.2",
    "57.1",
    "61.2",
    "55.7",
    "57.0",
    "58.3",
    "59.6",
    "60.9",
    "62.2",
    "63.5",
    "64.8",
    "827.0",
  ],
];

export default function GridWithCellInfo() {
  const [gridData] = useState(data);

  const [selection, setSelection] = useState<GridSelection>({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  });

  // Single cell navigation inputs
  const [columnInput, setColumnInput] = useState("");
  const [rowInput, setRowInput] = useState("");

  // Range selection inputs
  const [startColInput, setStartColInput] = useState("");
  const [startRowInput, setStartRowInput] = useState("");
  const [endColInput, setEndColInput] = useState("");
  const [endRowInput, setEndRowInput] = useState("");

  const activeCell = selection.current?.cell;
  const selectedRange = selection.current?.range;

  const getColumnLetter = useCallback((index: number): string => {
    let result = "";
    let i = index;

    while (i >= 0) {
      result = String.fromCharCode((i % 26) + 65) + result;
      i = Math.floor(i / 26) - 1;
    }

    return result;
  }, []);

  useEffect(() => {
    if (activeCell) {
      setColumnInput(getColumnLetter(activeCell[0]));
      setRowInput(String(activeCell[1] + 1));
    }
  }, [activeCell, getColumnLetter]);

  // Update range inputs when selection changes
  useEffect(() => {
    if (selectedRange) {
      const startCol = selectedRange.x;
      const startRow = selectedRange.y;
      const endCol = selectedRange.x + selectedRange.width - 1;
      const endRow = selectedRange.y + selectedRange.height - 1;

      setStartColInput(getColumnLetter(startCol));
      setStartRowInput(String(startRow + 1));
      setEndColInput(getColumnLetter(endCol));
      setEndRowInput(String(endRow + 1));
    }
  }, [selectedRange, getColumnLetter]);

  const columns: GridColumn[] = useMemo(
    () =>
      Array.from({ length: gridData[0].length }, (_, i) => ({
        title: getColumnLetter(i),
        width: 120,
      })),
    [gridData, getColumnLetter]
  );

  const getCellContent = useCallback(
    ([col, row]: Item): GridCell => {
      const value = gridData[row]?.[col];
      if (!value)
        return { kind: "text", data: "", displayData: "", allowOverlay: false };

      return {
        kind: "text",
        data: value,
        displayData: value,
        allowOverlay: false,
      };
    },
    [gridData]
  );

  // Navigate to single cell
  const handleNavigate = useCallback(() => {
    const colIndex = columnInput.toUpperCase().charCodeAt(0) - 65;
    const rowIndex = parseInt(rowInput, 10) - 1;

    if (
      colIndex >= 0 &&
      colIndex < columns.length &&
      rowIndex >= 0 &&
      rowIndex < gridData.length
    ) {
      setSelection({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty(),
        current: {
          cell: [colIndex, rowIndex],
          range: { x: colIndex, y: rowIndex, width: 1, height: 1 },
          rangeStack: [],
        },
      });
    }
  }, [columnInput, rowInput, columns.length, gridData.length]);

  // Select range based on inputs
  const handleRangeSelect = useCallback(() => {
    const startCol = startColInput.toUpperCase().charCodeAt(0) - 65;
    const startRow = parseInt(startRowInput, 10) - 1;
    const endCol = endColInput.toUpperCase().charCodeAt(0) - 65;
    const endRow = parseInt(endRowInput, 10) - 1;

  
    if (
      startCol >= 0 &&
      startCol < columns.length &&
      endCol >= 0 &&
      endCol < columns.length &&
      startRow >= 0 &&
      startRow < gridData.length &&
      endRow >= 0 &&
      endRow < gridData.length &&
      startCol <= endCol &&
      startRow <= endRow
    ) {
      const width = endCol - startCol + 1;
      const height = endRow - startRow + 1;

      setSelection({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty(),
        current: {
          cell: [startCol, startRow],
          range: { x: startCol, y: startRow, width, height },
          rangeStack: [],
        },
      });
    } else {
      alert("Invalid range. Please check your inputs.");
    }
  }, [
    startColInput,
    startRowInput,
    endColInput,
    endRowInput,
    columns.length,
    gridData.length,
  ]);

  // Get range information
  const getRangeInfo = useCallback(() => {
    if (!selectedRange) return null;

    const startCol = selectedRange.x;
    const startRow = selectedRange.y;
    const endCol = selectedRange.x + selectedRange.width - 1;
    const endRow = selectedRange.y + selectedRange.height - 1;

    // Extract all cells in the range
    const rangeData: string[][] = [];
    for (let row = startRow; row <= endRow; row++) {
      const rowData: string[] = [];
      for (let col = startCol; col <= endCol; col++) {
        rowData.push(gridData[row]?.[col] || "");
      }
      rangeData.push(rowData);
    }

    return {
      startCell: `${getColumnLetter(startCol)}${startRow + 1}`,
      endCell: `${getColumnLetter(endCol)}${endRow + 1}`,
      startCol,
      startRow,
      endCol,
      endRow,
      width: selectedRange.width,
      height: selectedRange.height,
      totalCells: selectedRange.width * selectedRange.height,
      rangeData,
    };
  }, [selectedRange, gridData, getColumnLetter]);

  const rangeInfo = getRangeInfo();

  return (
    <div style={{ padding: 16 }}>
      {/* Single Cell Navigation */}
      <div
        style={{
          marginBottom: 15,
          padding: 10,
          border: "1px solid #2196F3",
          borderRadius: 4,
          backgroundColor: "#E3F2FD",
        }}
      >
        <h4 style={{ margin: "0 0 10px 0" }}>Navigate to S`ingle Cell</h4>
        <div>
          <input
            type="text"
            value={columnInput}
            onChange={(e) => setColumnInput(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && handleNavigate()}
            placeholder="A"
            style={{ width: 50, marginRight: 8, padding: 4 }}
          />
          <span style={{ marginRight: 8 }}>Column</span>

          <input
            type="number"
            value={rowInput}
            onChange={(e) => setRowInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleNavigate()}
            placeholder="1"
            style={{ width: 60, marginRight: 8, padding: 4 }}
          />
          <span style={{ marginRight: 8 }}>Row</span>

          <button
            onClick={handleNavigate}
            style={{
              padding: "4px 12px",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Go
          </button>
        </div>
      </div>

      {/* Range Selection */}
      <div
        style={{
          marginBottom: 15,
          padding: 10,
          border: "1px solid #4CAF50",
          borderRadius: 4,
          backgroundColor: "#E8F5E9",
        }}
      >
        <h4 style={{ margin: "0 0 10px 0" }}>Select Range</h4>
        <div style={{ marginBottom: 10 }}>
          <strong>Start Cell:</strong>
          <input
            type="text"
            value={startColInput}
            onChange={(e) => setStartColInput(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && handleRangeSelect()}
            placeholder="A"
            style={{ width: 50, marginLeft: 8, marginRight: 8, padding: 4 }}
          />
          <span style={{ marginRight: 8 }}>Column</span>

          <input
            type="number"
            value={startRowInput}
            onChange={(e) => setStartRowInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRangeSelect()}
            placeholder="1"
            style={{ width: 60, marginRight: 8, padding: 4 }}
          />
          <span>Row</span>
        </div>

        <div style={{ marginBottom: 10 }}>
          <strong>End Cell:</strong>
          <input
            type="text"
            value={endColInput}
            onChange={(e) => setEndColInput(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && handleRangeSelect()}
            placeholder="C"
            style={{ width: 50, marginLeft: 8, marginRight: 8, padding: 4 }}
          />
          <span style={{ marginRight: 8 }}>Column</span>

          <input
            type="number"
            value={endRowInput}
            onChange={(e) => setEndRowInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRangeSelect()}
            placeholder="5"
            style={{ width: 60, marginRight: 8, padding: 4 }}
          />
          <span>Row</span>
        </div>

        <button
          onClick={handleRangeSelect}
          style={{
            padding: "6px 16px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Select Range
        </button>
      </div>

      {/* Active Cell Info */}
      <div
        style={{
          marginBottom: 10,
          padding: "6px 10px",
          border: "1px solid #ddd",
          borderRadius: 4,
          fontWeight: 500,
        }}
      >
        {activeCell
          ? `Active Cell: ${getColumnLetter(activeCell[0])}${
              activeCell[1] + 1
            } - Value: "${gridData[activeCell[1]]?.[activeCell[0]] || ""}"`
          : "Click any cell"}
      </div>

      {/* Range Selection Info */}
      {rangeInfo && rangeInfo.totalCells > 1 && (
        <div
          style={{
            marginBottom: 10,
            padding: "10px",
            border: "2px solid #4CAF50",
            borderRadius: 4,
            backgroundColor: "#f1f8f4",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: 10 }}>
            Selected Range Information
          </h3>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={{ padding: "4px 8px", fontWeight: "bold" }}>
                  Range:
                </td>
                <td style={{ padding: "4px 8px" }}>
                  {rangeInfo.startCell} to {rangeInfo.endCell}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "4px 8px", fontWeight: "bold" }}>
                  Dimensions:
                </td>
                <td style={{ padding: "4px 8px" }}>
                  {rangeInfo.width} columns × {rangeInfo.height} rows
                </td>
              </tr>
              <tr>
                <td style={{ padding: "4px 8px", fontWeight: "bold" }}>
                  Total Cells:
                </td>
                <td style={{ padding: "4px 8px" }}>{rangeInfo.totalCells}</td>
              </tr>
            </tbody>
          </table>

          {/* Preview of selected data */}
          <details style={{ marginTop: 10 }}>
            <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
              View Selected Data ({rangeInfo.totalCells} cells)
            </summary>
            <div
              style={{
                marginTop: 10,
                maxHeight: "200px",
                overflow: "auto",
                border: "1px solid #ddd",
                borderRadius: 4,
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "12px",
                }}
              >
                <tbody>
                  {rangeInfo.rangeData.map((row, rowIdx) => (
                    <tr key={rowIdx}>
                      {row.map((cell, colIdx) => (
                        <td
                          key={colIdx}
                          style={{
                            padding: "4px 8px",
                            border: "1px solid #ddd",
                            backgroundColor: "#fff",
                          }}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </div>
      )}

      {/* Data Grid */}
      <div style={{ height: "600px", width: "100%" }}>
        <DataEditor
          columns={columns}
          rows={gridData.length}
          getCellContent={getCellContent}
          rowMarkers="number"
          freezeColumns={1}
          gridSelection={selection}
          onGridSelectionChange={setSelection}
          rangeSelect="rect"
          columnSelect="multi"
          rowSelect="multi"
        />
      </div>
    </div>
  );
}
