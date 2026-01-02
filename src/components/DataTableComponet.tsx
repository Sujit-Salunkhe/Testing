import "@glideapps/glide-data-grid/dist/index.css";
import { DataEditor, CompactSelection, GridCellKind } from "@glideapps/glide-data-grid";
import type {
  GridCell,
  GridColumn,
  Item,
  GridSelection,
  DrawHeaderCallback,
} from "@glideapps/glide-data-grid";
import { useState, useCallback, useMemo, useEffect, memo, useRef } from "react";
import { data } from "../assets/data";

// Types & Interfaces
interface RangeInfo {
  startCell: string;
  endCell: string;
  startCol: number;
  startRow: number;
  endCol: number;
  endRow: number;
  width: number;
  height: number;
  totalCells: number;
  rangeData: string[][];
}

interface NavigationInputsProps {
  columnInput: string;
  rowInput: string;
  onColumnChange: (value: string) => void;
  onRowChange: (value: string) => void;
  onNavigate: () => void;
}

interface RangeInputsProps {
  startColInput: string;
  startRowInput: string;
  endColInput: string;
  endRowInput: string;
  onStartColChange: (value: string) => void;
  onStartRowChange: (value: string) => void;
  onEndColChange: (value: string) => void;
  onEndRowChange: (value: string) => void;
  onRangeSelect: () => void;
}

interface FrozenRowsControlProps {
  frozenRowCount: number;
  onFrozenRowCountChange: (count: number) => void;
  maxRows: number;
}

// Constants
const DEFAULT_COLUMN_WIDTH = 120;
const GRID_HEIGHT = 550;
const ROW_MARKER_WIDTH = 50;

// Utility Functions
const getColumnLetter = (index: number): string => {
  let result = "";
  let i = index;

  while (i >= 0) {
    result = String.fromCharCode((i % 26) + 65) + result;
    i = Math.floor(i / 26) - 1;
  }

  return result;
};

const columnLetterToIndex = (letter: string): number => {
  return letter.toUpperCase().charCodeAt(0) - 65;
};

const isValidColumnIndex = (index: number, maxColumns: number): boolean => {
  return index >= 0 && index < maxColumns;
};

const isValidRowIndex = (index: number, maxRows: number): boolean => {
  return index >= 0 && index < maxRows;
};

// Sub-components
const FrozenRowsControl = memo<FrozenRowsControlProps>(
  ({ frozenRowCount, onFrozenRowCountChange, maxRows }) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value >= 0 && value <= Math.min(maxRows, 20)) {
          onFrozenRowCountChange(value);
        }
      },
      [onFrozenRowCountChange, maxRows]
    );

    return (
      <div
        style={{
          marginBottom: 15,
          padding: 10,
          border: "1px solid #FF9800",
          borderRadius: 4,
          backgroundColor: "#FFF3E0",
        }}
      >
        <h4 style={{ margin: "0 0 10px 0" }}>Freeze Top Rows</h4>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <label htmlFor="frozenRowInput">Number of rows to freeze:</label>
          <input
            id="frozenRowInput"
            type="number"
            value={frozenRowCount}
            onChange={handleChange}
            min="0"
            max={Math.min(maxRows, 20)}
            style={{
              width: 80,
              padding: "6px 8px",
              border: "1px solid #ddd",
              borderRadius: 4,
            }}
            aria-label="Frozen row count"
          />
          <span style={{ fontSize: 12, color: "#666" }}>
            {frozenRowCount > 0
              ? `(Rows 1-${frozenRowCount} will stay at top)`
              : "(No rows frozen)"}
          </span>
        </div>
      </div>
    );
  }
);

FrozenRowsControl.displayName = "FrozenRowsControl";

const NavigationInputs = memo<NavigationInputsProps>(
  ({ columnInput, rowInput, onColumnChange, onRowChange, onNavigate }) => {
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
          onNavigate();
        }
      },
      [onNavigate]
    );

    return (
      <div
        style={{
          marginBottom: 15,
          padding: 10,
          border: "1px solid #2196F3",
          borderRadius: 4,
          backgroundColor: "#E3F2FD",
        }}
      >
        <h4 style={{ margin: "0 0 10px 0" }}>Navigate to Single Cell</h4>
        <div>
          <input
            type="text"
            value={columnInput}
            onChange={(e) => onColumnChange(e.target.value.toUpperCase())}
            onKeyDown={handleKeyDown}
            placeholder="A"
            maxLength={2}
            style={{ width: 50, marginRight: 8, padding: 4 }}
            aria-label="Column"
          />
          <span style={{ marginRight: 8 }}>Column</span>

          <input
            type="number"
            value={rowInput}
            onChange={(e) => onRowChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="1"
            min="1"
            style={{ width: 60, marginRight: 8, padding: 4 }}
            aria-label="Row"
          />
          <span style={{ marginRight: 8 }}>Row</span>

          <button
            onClick={onNavigate}
            style={{
              padding: "4px 12px",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
            aria-label="Navigate to cell"
          >
            Go
          </button>
        </div>
      </div>
    );
  }
);

NavigationInputs.displayName = "NavigationInputs";

const RangeInputs = memo<RangeInputsProps>(
  ({
    startColInput,
    startRowInput,
    endColInput,
    endRowInput,
    onStartColChange,
    onStartRowChange,
    onEndColChange,
    onEndRowChange,
    onRangeSelect,
  }) => {
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
          onRangeSelect();
        }
      },
      [onRangeSelect]
    );

    return (
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
            onChange={(e) => onStartColChange(e.target.value.toUpperCase())}
            onKeyDown={handleKeyDown}
            placeholder="A"
            maxLength={2}
            style={{ width: 50, marginLeft: 8, marginRight: 8, padding: 4 }}
            aria-label="Start column"
          />
          <span style={{ marginRight: 8 }}>Column</span>

          <input
            type="number"
            value={startRowInput}
            onChange={(e) => onStartRowChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="1"
            min="1"
            style={{ width: 60, marginRight: 8, padding: 4 }}
            aria-label="Start row"
          />
          <span>Row</span>
        </div>

        <div style={{ marginBottom: 10 }}>
          <strong>End Cell:</strong>
          <input
            type="text"
            value={endColInput}
            onChange={(e) => onEndColChange(e.target.value.toUpperCase())}
            onKeyDown={handleKeyDown}
            placeholder="C"
            maxLength={2}
            style={{ width: 50, marginLeft: 8, marginRight: 8, padding: 4 }}
            aria-label="End column"
          />
          <span style={{ marginRight: 8 }}>Column</span>

          <input
            type="number"
            value={endRowInput}
            onChange={(e) => onEndRowChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="5"
            min="1"
            style={{ width: 60, marginRight: 8, padding: 4 }}
            aria-label="End row"
          />
          <span>Row</span>
        </div>

        <button
          onClick={onRangeSelect}
          style={{
            padding: "6px 16px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            fontWeight: "bold",
          }}
          aria-label="Select range"
        >
          Select Range
        </button>
      </div>
    );
  }
);

RangeInputs.displayName = "RangeInputs";

const ActiveCellDisplay = memo<{
  activeCell: readonly [number, number] | undefined;
  gridData: string[][];
  frozenRowCount: number;
}>(({ activeCell, gridData, frozenRowCount }) => {
  if (!activeCell) {
    return (
      <div
        style={{
          marginBottom: 10,
          padding: "6px 10px",
          border: "1px solid #ddd",
          borderRadius: 4,
          fontWeight: 500,
        }}
      >
        Click any cell
      </div>
    );
  }

  const displayRow = activeCell[1] + frozenRowCount + 1;
  const cellValue = gridData[activeCell[1] + frozenRowCount]?.[activeCell[0]] || "";
  const cellAddress = `${getColumnLetter(activeCell[0])}${displayRow}`;

  return (
    <div
      style={{
        marginBottom: 10,
        padding: "6px 10px",
        border: "1px solid #ddd",
        borderRadius: 4,
        fontWeight: 500,
      }}
    >
      Active Cell: {cellAddress} - Value: "{cellValue}"
    </div>
  );
});

ActiveCellDisplay.displayName = "ActiveCellDisplay";

const RangeInfoDisplay = memo<{ rangeInfo: RangeInfo | null }>(
  ({ rangeInfo }) => {
    if (!rangeInfo || rangeInfo.totalCells <= 1) {
      return null;
    }

    return (
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
              <td style={{ padding: "4px 8px", fontWeight: "bold" }}>Range:</td>
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
    );
  }
);

RangeInfoDisplay.displayName = "RangeInfoDisplay";

// Main Component
export default function GridWithCellInfo() {
  const [gridData] = useState<string[][]>(data);
  const [frozenRowCount, setFrozenRowCount] = useState(2);
  const [columns, setColumns] = useState<GridColumn[]>(() =>
    Array.from({ length: data[0]?.length || 20 }, (_, i) => ({
      title: getColumnLetter(i),
      width: DEFAULT_COLUMN_WIDTH,
      id: `col-${i}`,
    }))
  );

  const [selection, setSelection] = useState<GridSelection>({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  });

  const [columnInput, setColumnInput] = useState("");
  const [rowInput, setRowInput] = useState("");
  const [startColInput, setStartColInput] = useState("");
  const [startRowInput, setStartRowInput] = useState("");
  const [endColInput, setEndColInput] = useState("");
  const [endRowInput, setEndRowInput] = useState("");

  // Refs for scroll synchronization
  const frozenTableRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  const activeCell = selection.current?.cell;
  const selectedRange = selection.current?.range;

  // Split data into frozen and scrollable
  const frozenRows = useMemo(
    () => gridData.slice(0, frozenRowCount),
    [gridData, frozenRowCount]
  );

  const scrollableData = useMemo(
    () => gridData.slice(frozenRowCount),
    [gridData, frozenRowCount]
  );

  // Synchronize horizontal scroll between frozen table and grid
  useEffect(() => {
    const gridContainer = gridContainerRef.current;
    const frozenTable = frozenTableRef.current;

    if (!gridContainer || !frozenTable) return;

    const handleGridScroll = () => {
      const scrollElement = gridContainer.querySelector('.dvn-scroller');
      if (scrollElement) {
        frozenTable.scrollLeft = scrollElement.scrollLeft;
      }
    };

    // Find the scroller element inside the grid
    const scrollElement = gridContainer.querySelector('.dvn-scroller');
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleGridScroll);
      return () => {
        scrollElement.removeEventListener('scroll', handleGridScroll);
      };
    }
  }, [frozenRowCount]);

  // Sync active cell to inputs
  useEffect(() => {
    if (activeCell) {
      setColumnInput(getColumnLetter(activeCell[0]));
      setRowInput(String(activeCell[1] + frozenRowCount + 1));
    }
  }, [activeCell, frozenRowCount]);

  // Sync selected range to inputs
  useEffect(() => {
    if (selectedRange) {
      const startCol = selectedRange.x;
      const startRow = selectedRange.y + frozenRowCount;
      const endCol = selectedRange.x + selectedRange.width - 1;
      const endRow = selectedRange.y + selectedRange.height - 1 + frozenRowCount;

      setStartColInput(getColumnLetter(startCol));
      setStartRowInput(String(startRow + 1));
      setEndColInput(getColumnLetter(endCol));
      setEndRowInput(String(endRow + 1));
    }
  }, [selectedRange, frozenRowCount]);

  // Get cell content for scrollable grid
  const getCellContent = useCallback(
    ([col, row]: Item): GridCell => {
      const value = scrollableData[row]?.[col] || "";

      return {
        kind: GridCellKind.Text,
        data: value,
        displayData: value,
        allowOverlay: false,
      };
    },
    [scrollableData]
  );

  // Custom header renderer
  const drawHeader: DrawHeaderCallback = useCallback((args) => {
    const { ctx, rect, column, theme, isSelected } = args;

    ctx.save();

    ctx.fillStyle = isSelected ? theme.accentColor : theme.bgHeader;
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

    ctx.strokeStyle = theme.borderColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

    ctx.fillStyle = isSelected ? theme.accentFg : theme.textHeader;
    ctx.font = "bold 13px";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(column.title, rect.x + rect.width / 2, rect.y + rect.height / 2);

    ctx.restore();
    return true;
  }, []);

  // Navigate to single cell
  const handleNavigate = useCallback(() => {
    const colIndex = columnLetterToIndex(columnInput);
    const rowIndex = parseInt(rowInput, 10) - 1 - frozenRowCount;

    if (
      !isValidColumnIndex(colIndex, columns.length) ||
      !isValidRowIndex(rowIndex, scrollableData.length)
    ) {
      alert("Invalid cell address. Please check your inputs.");
      return;
    }

    setSelection({
      columns: CompactSelection.empty(),
      rows: CompactSelection.empty(),
      current: {
        cell: [colIndex, rowIndex],
        range: { x: colIndex, y: rowIndex, width: 1, height: 1 },
        rangeStack: [],
      },
    });
  }, [columnInput, rowInput, columns.length, scrollableData.length, frozenRowCount]);

  // Select range
  const handleRangeSelect = useCallback(() => {
    const startCol = columnLetterToIndex(startColInput);
    const startRow = parseInt(startRowInput, 10) - 1 - frozenRowCount;
    const endCol = columnLetterToIndex(endColInput);
    const endRow = parseInt(endRowInput, 10) - 1 - frozenRowCount;

    if (
      !isValidColumnIndex(startCol, columns.length) ||
      !isValidColumnIndex(endCol, columns.length) ||
      !isValidRowIndex(startRow, scrollableData.length) ||
      !isValidRowIndex(endRow, scrollableData.length) ||
      startCol > endCol ||
      startRow > endRow
    ) {
      alert("Invalid range. Please check your inputs.");
      return;
    }

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
  }, [
    startColInput,
    startRowInput,
    endColInput,
    endRowInput,
    columns.length,
    scrollableData.length,
    frozenRowCount,
  ]);

  // Get range information
  const getRangeInfo = useCallback((): RangeInfo | null => {
    if (!selectedRange) return null;

    const startCol = selectedRange.x;
    const startRow = selectedRange.y + frozenRowCount;
    const endCol = selectedRange.x + selectedRange.width - 1;
    const endRow = selectedRange.y + selectedRange.height - 1 + frozenRowCount;

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
  }, [selectedRange, gridData, frozenRowCount]);

  const rangeInfo = useMemo(() => getRangeInfo(), [getRangeInfo]);

  // Column resize handler
  const onColumnResize = useCallback(
    (column: GridColumn, newSize: number, colIndex: number) => {
      setColumns((prevColumns) => {
        const newColumns = [...prevColumns];
        newColumns[colIndex] = {
          ...newColumns[colIndex],
          width: newSize,
        };
        return newColumns;
      });
    },
    []
  );

  return (
    <div style={{ padding: 16 }}>
      <FrozenRowsControl
        frozenRowCount={frozenRowCount}
        onFrozenRowCountChange={setFrozenRowCount}
        maxRows={gridData.length}
      />

      <NavigationInputs
        columnInput={columnInput}
        rowInput={rowInput}
        onColumnChange={setColumnInput}
        onRowChange={setRowInput}
        onNavigate={handleNavigate}
      />

      <RangeInputs
        startColInput={startColInput}
        startRowInput={startRowInput}
        endColInput={endColInput}
        endRowInput={endRowInput}
        onStartColChange={setStartColInput}
        onStartRowChange={setStartRowInput}
        onEndColChange={setEndColInput}
        onEndRowChange={setEndRowInput}
        onRangeSelect={handleRangeSelect}
      />

      <ActiveCellDisplay
        activeCell={activeCell}
        gridData={gridData}
        frozenRowCount={frozenRowCount}
      />

      <RangeInfoDisplay rangeInfo={rangeInfo} />

      <div
        style={{
          marginBottom: 10,
          padding: 10,
          border: "1px solid #4CAF50",
          borderRadius: 4,
          backgroundColor: "#E8F5E9",
          fontSize: 13,
        }}
      >
        <strong>✅ True Frozen Rows:</strong> The top {frozenRowCount} row(s) stay
        fixed at the top. Horizontal scrolling is synchronized automatically.
      </div>

      {/* Container for both frozen and scrollable sections */}
      <div style={{ border: "1px solid #ddd", borderRadius: 4, overflow: "hidden" }}>
        {/* Frozen Rows Table - Stays at top with synchronized horizontal scroll */}
        {frozenRowCount > 0 && (
          <div
            ref={frozenTableRef}
            style={{
              position: "relative",
              zIndex: 10,
              backgroundColor: "white",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              borderBottom: "2px solid #FF9800",
              overflowX: "hidden", // Hide scrollbar but allow programmatic scroll
              overflowY: "hidden",
            }}
          >
            <table
              style={{
                borderCollapse: "collapse",
                marginBottom: 0,
                tableLayout: "fixed",
              }}
            >
              <tbody>
                {frozenRows.map((row, rowIdx) => (
                  <tr key={rowIdx} style={{ backgroundColor: "#f0f0f0" }}>
                    <td
                      style={{
                        padding: "8px",
                        border: "1px solid #ddd",
                        fontWeight: 600,
                        width: ROW_MARKER_WIDTH,
                        textAlign: "center",
                        backgroundColor: "#e0e0e0",
                      }}
                    >
                      {rowIdx + 1}
                    </td>
                    {row.map((cell, colIdx) => (
                      <td
                        key={colIdx}
                        style={{
                          padding: "8px",
                          border: "1px solid #ddd",
                          fontWeight: 600,
                          width: columns[colIdx]?.width || DEFAULT_COLUMN_WIDTH,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
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
        )}

        {/* Scrollable Data Grid */}
        <div ref={gridContainerRef} style={{ height: GRID_HEIGHT }}>
          <DataEditor
            columns={columns}
            rows={scrollableData.length}
            getCellContent={getCellContent}
            rowMarkers="number"
            freezeColumns={1}
            gridSelection={selection}
            onGridSelectionChange={setSelection}
            rangeSelect="rect"
            columnSelect="multi"
            rowSelect="multi"
            onColumnResize={onColumnResize}
            drawHeader={drawHeader}
            smoothScrollX={true}
            smoothScrollY={true}
            rowHeight={32}
            headerHeight={36}
            theme={{
              accentColor: "#2196F3",
              accentFg: "#FFFFFF",
              accentLight: "rgba(33, 150, 243, 0.1)",
              textDark: "#313139",
              textMedium: "#737383",
              textLight: "#b0b0b8",
              textBubble: "#313139",
              bgIconHeader: "#737383",
              fgIconHeader: "#FFFFFF",
              textHeader: "#313139",
              textHeaderSelected: "#FFFFFF",
              bgCell: "#FFFFFF",
              bgCellMedium: "#fafafa",
              bgHeader: "#f7f7f8",
              bgHeaderHasFocus: "#e9e9eb",
              bgHeaderHovered: "#e9e9eb",
              bgBubble: "#FFFFFF",
              bgBubbleSelected: "#FFFFFF",
              bgSearchResult: "#fff9c4",
              borderColor: "rgba(115, 115, 131, 0.16)",
              drilldownBorder: "rgba(0, 0, 0, 0.16)",
              linkColor: "#2196F3",
              headerFontStyle: "bold 13px",
              baseFontStyle: "13px",
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
            }}
          />
        </div>
      </div>
    </div>
  );
}
