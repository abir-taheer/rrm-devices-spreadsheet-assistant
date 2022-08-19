import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useAtom } from "jotai";
import { useMemo, useState } from "react";
import PhoneLookupSearchValueAtom from "../../atoms/PhoneLookupSearchValueAtom";
import useLookupPhoneNumbers from "../../utils/useLookupPhoneNumbers";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreOutlined from "@mui/icons-material/ExpandMoreOutlined";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import { utils } from "xlsx";

function download(data: string, filename: string, type: string) {
  var file = new Blob([data], { type });
  if ((window.navigator as any)?.msSaveOrOpenBlob) {
    (window.navigator as any)?.msSaveOrOpenBlob?.(file, filename);
  } else {
    // Others
    var a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}

const columns = [
  {
    field: "deviceRow",
    headerName: "Row in Devices DB",
    width: 180,
  },
  {
    field: "rosterRow",
    headerName: "Row in Roster",
    width: 180,
  },
  {
    field: "formattedPhone",
    width: 180,
    headerName: "Phone",
    filterable: true,
  },

  {
    field: "typeOfDevice",
    headerName: "Device Type",
    width: 180,
  },
  {
    field: "serviceType",
    headerName: "Service Type",
    width: 150,
  },
  {
    field: "unit",
    headerName: "Work Unit",
    width: 350,
  },
  {
    field: "workLocation",
    headerName: "Work Location",
    width: 350,
  },
  {
    field: "workUnitCode",

    headerName: "Work Unit Code",
    width: 100,
  },
  {
    field: "firstName",
    headerName: "First Name",
    width: 150,
  },
  {
    field: "lastName",
    headerName: "Last Name",
    width: 150,
  },
  {
    field: "pms",
    headerName: "PMS",
    width: 100,
  },
  {
    field: "title",
    headerName: "Title",
    width: 250,
  },
  {
    field: "employeeType",
    headerName: "Employee Type",
    width: 250,
  },
  {
    field: "supervisor",
    headerName: "Supervisor",
    width: 180,
  },
  {
    field: "comments",
    headerName: "Comments",
    width: 240,
  },
  {
    field: "historicalComments",
    headerName: "Historical Comments",
    width: 240,
  },
];

export default function PhoneLookupResults() {
  const [numbers] = useAtom(PhoneLookupSearchValueAtom);
  const lookupNumbers = useLookupPhoneNumbers();
  const [groupBy, setGroupBy] = useState<
    "unit" | "workLocation" | "supervisor"
  >("workLocation");

  const results = useMemo(
    () => lookupNumbers(numbers),
    [numbers, lookupNumbers]
  );

  const groupedResults = useMemo(() => {
    if (groupBy === "unit") {
      return results.confidentMatchesGroupedByWorkUnit;
    } else if (groupBy === "workLocation") {
      return results.confidentMatchesGroupedByWorkLocation;
    } else {
      return results.confidentMatchesGroupedBySupervisor;
    }
  }, [results, groupBy]);

  const labelField =
    groupBy === "unit"
      ? "workUnit"
      : groupBy === "supervisor"
      ? "supervisor"
      : "workLocation";

  const noRosterMatches = results.noConfidenceMatchesWithGuesses.filter(
    (a) => !a.roster.exact.length && !a.roster.fuzzy.length
  );

  const possibleRosterMatches = results.noConfidenceMatchesWithGuesses.filter(
    (a) => a.roster.exact.length || a.roster.fuzzy.length
  );

  const generateGroupedCsv = () => {
    const rows = [["", ...columns.map((a) => a.headerName)], []];

    groupedResults.map((res) => {
      rows.push([(res as any)[labelField]]);

      rows.push(
        ...res.matches
          .map((a) => ({
            ...a.device,
            deviceRow: a.device.row,
            ...a.roster.exact[0],
            rosterRow: a.roster.exact[0].row,
          }))
          .map((match) => [
            "",
            ...columns.map(({ field }) => (match as any)[field]),
          ]),
        []
      );
    });
    download(
      utils.sheet_to_csv(utils.json_to_sheet(rows)).replace(/[0-9,]+\n/, ""),
      "Bulk Lookup Results.csv",
      "text/csv"
    );
  };

  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={
            <IconButton>
              <ExpandMoreOutlined />
            </IconButton>
          }
        >
          <Typography fontSize={18}>
            Confident Matches With Exact Roster Results (
            {results.confidentMatchesGroupedByWorkUnit.reduce(
              (a, b) => a + b.matches.length,
              0
            )}
            )
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <Select
            value={groupBy}
            onChange={(ev) =>
              setGroupBy(ev.target.value as "unit" | "workLocation")
            }
          >
            <MenuItem value="workLocation">
              Group by Roster "Work Location"
            </MenuItem>
            <MenuItem value="unit">Group by Devices Database "Unit"</MenuItem>
            <MenuItem value="supervisor">Group by Roster "Supervisor"</MenuItem>
          </Select>
          <br />
          <Button
            variant="outlined"
            style={{ margin: "20px 0" }}
            onClick={generateGroupedCsv}
          >
            Save Exact Matches To Spreadsheet
          </Button>
          <br />
          {groupedResults.map((group, index) => {
            return (
              <div key={index}>
                <h2>{(group as any)[labelField] || "Unknown"}</h2>
                <div
                  style={{
                    height: Math.min(
                      Math.max(group.matches.length * 100, 250),
                      600
                    ),
                  }}
                >
                  <DataGrid
                    checkboxSelection
                    editMode="row"
                    getRowId={(row) => row.deviceRow}
                    columns={columns}
                    // Join together all of the fields because there's not really a point in keeping them separate
                    rows={group.matches.map((a) => ({
                      ...a.device,
                      deviceRow: a.device.row,
                      ...a.roster.exact[0],
                      rosterRow: a.roster.exact[0].row,
                    }))}
                    rowBuffer={4}
                    components={{
                      Toolbar: GridToolbar,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={
            <IconButton>
              <ExpandMoreOutlined />
            </IconButton>
          }
        >
          <Typography fontSize={18}>
            Database Matches With No Roster Results ({noRosterMatches.length})
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <p>Numbers with no Roster Matches</p>
          <div
            style={{
              height: Math.min(
                Math.max(noRosterMatches.length * 100, 250),
                600
              ),
            }}
          >
            <DataGrid
              editMode="row"
              checkboxSelection
              getRowId={(row) => row.deviceRow}
              columns={[
                {
                  field: "deviceRow",
                  headerName: "Row in Devices Database",
                  width: 100,
                },
                {
                  field: "formattedPhone",
                  width: 180,
                  headerName: "Phone",
                  filterable: true,
                },

                {
                  field: "fullName",
                  headerName: "Full Name",
                  width: 250,
                },
                {
                  field: "unit",
                  headerName: "Work Unit",
                  width: 350,
                },
                {
                  field: "typeOfDevice",
                  headerName: "Device Type",
                  width: 180,
                },
                {
                  field: "serviceType",
                  headerName: "Service Type",
                  width: 150,
                },
              ]}
              // Join together all of the fields because there's not really a point in keeping them separate
              rows={noRosterMatches.map((a) => ({
                ...a.device,
                deviceRow: a.device.row,
              }))}
              rowBuffer={4}
              components={{
                Toolbar: GridToolbar,
              }}
            />
          </div>
        </AccordionDetails>
      </Accordion>

      {/*


*/}

      <Accordion>
        <AccordionSummary
          expandIcon={
            <IconButton>
              <ExpandMoreOutlined />
            </IconButton>
          }
        >
          <Typography fontSize={18}>
            Database Matches With Ambiguous Roster Results (
            {possibleRosterMatches.length})
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          {possibleRosterMatches.map((match) => (
            <>
              <p>
                Match from the Devices Database for{" "}
                {match.device.formattedPhone}
              </p>
              <div style={{ overflow: "auto", maxWidth: "100%" }}>
                <table
                  border={1}
                  style={{ maxWidth: "100%", overflow: "auto" }}
                >
                  <thead>
                    <tr>
                      {Object.keys(match.device).map((key) => (
                        <th key={key}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {Object.keys(match.device).map((key) => (
                        <td key={key} style={{ padding: "0 10px" }}>
                          {(match.device as any)?.[key]}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>Exact Matches</p>
              <div style={{ overflow: "auto", maxWidth: "100%" }}>
                {match.roster.exact.length ? (
                  <table border={1}>
                    <thead>
                      <tr>
                        {Object.keys(match.roster.exact[0]).map((key) => (
                          <th key={key}>{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {match.roster.exact.map((item) => (
                        <tr>
                          {Object.keys(item).map((key) => (
                            <td key={key}>{(item as any)?.[key]}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ color: "grey" }}>
                    There were no exact matches from the roster
                  </p>
                )}
              </div>
              <p>Fuzzy Matches</p>
              <div style={{ overflow: "auto", maxWidth: "100%" }}>
                {match.roster.fuzzy.length ? (
                  <table border={1}>
                    <thead>
                      <tr>
                        {Object.keys(match.roster.fuzzy[0]).map((key) => (
                          <th key={key}>{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {match.roster.fuzzy.map((item) => (
                        <tr>
                          {Object.keys(item).map((key) => (
                            <td key={key}>{(item as any)?.[key]}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ color: "grey" }}>
                    There were no fuzzy matches from the roster
                  </p>
                )}
              </div>

              <br />
            </>
          ))}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={
            <IconButton>
              <ExpandMoreOutlined />
            </IconButton>
          }
        >
          <Typography fontSize={18}>
            Phone Numbers Without Database Matches (
            {results.numbersWithoutDirectMatches.length})
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <p>
            The following numbers did not match to any row in the RRM Devices
            Database Table
          </p>

          <p>Invalid Numbers:</p>
          <ul>
            {results.numbersWithoutDirectMatches
              .filter((n) => n.length !== 10)
              .map((num) => (
                <li>{num}</li>
              ))}
          </ul>

          <p>Possibly Valid Numbers:</p>
          <ul>
            {results.numbersWithoutDirectMatches
              .filter((n) => n.length === 10)
              .map((num) => (
                // Format the number to look like a phone number
                <li>{num.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")}</li>
              ))}
          </ul>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
