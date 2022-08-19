import Link from "@mui/material/Link";

export default function HomePage() {
  return (
    <div>
      <h3>Hello!</h3>
      <h4>What does this app do?</h4>
      <p>
        It's meant to help sort through the RRM Devices spreadsheet and make it
        easier to do bulk phone number lookups as one needs to do for the
        zero-usage notifications that come in.
      </p>
      <h4>How do I use it?</h4>
      <p>
        The <b style={{ color: "green" }}>"Phone Lookup"</b> page is what you'll
        use for the bulk phone number search. You can just paste a list of phone
        numbers and hit the search button and it'll do the rest while also
        letting you know which ones were not found in the spreadsheets or if
        there were missing/duplicate results. The{" "}
        <b style={{ color: "green" }}>"Search Everywhere"</b> page will search
        through the Database Sheet and the Roster sheet for whatever you type
        into the search box and also tell you which row the results appear in
        the spreadsheets. The{" "}
        <b style={{ color: "green" }}>"Analyze Spreadsheet"</b> will let you
        know if there are any duplicates or possible typos in the roster and rrm
        database sheets
      </p>
      <h4>What do you need to do?</h4>

      <p>
        The app expects some consistency in the structure of the sheets and
        columns that it looks at. More specifically, it expects the following:
      </p>
      <ul>
        <li>There is a sheet called "Roster"</li>
        <li>The roster has a column called "First Name"</li>
        <li>The roster has a column called "Last Name"</li>
        <li>The roster has a column called "Work Location"</li>
        <li>There's a sheet called "RRM Devices Database"</li>
        <li>The database has a column called "Phone Number"</li>
        <li>The database has a column called "Full Name"</li>
        <li>The database has a column called "Unit"</li>
      </ul>
      <p>
        If these conditions are met, regardless of the rest of the data in the
        spreadsheet everything should still work as expected.
      </p>
      <h4>How does it work?</h4>
      <p>
        When you "upload" the spreadsheet to the app, it's not actually going
        anywhere. That's just so the browser gives this app access to the file
        and it can do its thing. It uses a library called{" "}
        <Link href="https://www.npmjs.com/package/xlsx" target={"_blank"}>
          xlsx
        </Link>{" "}
        to convert the raw binary from the excel file into objects and arrays
        that the javascript language can understand so that we can manipulate
        and query through the data using our own code. This means everything is
        happening on your computer, in your browser, and{" "}
        <b style={{ color: "green" }}>
          none of the information from the spreadsheet ever leaves your computer
        </b>
        .
      </p>

      <p>
        I've open sourced the code for this project and it is available on my
        github in case IT ever needs to make any changes or take a look at how
        it works.
        <br /> (
        <Link
          href="https://github.com/abir-taheer/rrm-devices-spreadsheet-assistant"
          target={"_blank"}
        >
          https://github.com/abir-taheer/rrm-devices-spreadsheet-assistant
        </Link>
        )
      </p>
      <p>
        Most of the code is fairly simple with the exception of the code
        responsible for doing the bulk phone number lookups. The code for that
        is visible{" "}
        <Link
          href="https://github.com/abir-taheer/rrm-devices-spreadsheet-assistant/blob/main/src/utils/useLookupPhoneNumbers.ts"
          target="_blank"
        >
          HERE
        </Link>
      </p>
      <p>The steps involved are as follows:</p>
      <ol>
        <li>
          First find all of the matching rows for the phone numbers in the{" "}
          <b>RRM Devices Database</b> sheet and make a note of the numbers that
          are not present in the sheet. We'll present those on the page later
          but this is where the road ends for them in the code.
        </li>
        <li>
          For the numbers that had valid rows in the Devices Databse Sheet look
          up the <code>"Full Name"</code> column value in the <b>Roster</b>{" "}
          sheet. This has two parts.
          <ol>
            <li>
              First we perform an <b>"exact"</b> search for the full name and
              only look for rows in the roster where the full name matches the
              first and last names exactly.
            </li>
            <li>
              Then we perform a <b>"fuzzy"</b> search where we look for rows in
              the roster using the{" "}
              <Link
                href="https://www.educative.io/answers/the-levenshtein-distance-algorithm"
                target="_blank"
              >
                Levenshtein Distance Algorithm
              </Link>{" "}
              and only make note of rows that have an "edit distance" of 1 or
              less in both the first and last names. In plain language, we're
              basically allowing for 1 typo in both the first and last name of
              the roster sheet in case the name was mispelled or there are
              people with very similar names that might get mixed up.
            </li>
          </ol>
        </li>
        <li>
          We then separate the results from the devices database based on how
          many matches the "Full Name" column had in the roster sheet. If any
          "Full Name" gives exactly 1 match in both the "exact" search as well
          as the "fuzzy" search we will call this a "confident" match and later
          group this according to its work unit. For any row in the database
          that had multiple matches in the roster or no matches in the roster we
          will display these seprately and allow them to be manually sorted.
        </li>
      </ol>
    </div>
  );
}
