function doPost(e) {
  try {
    console.log('Received POST request');
    console.log('Event object:', JSON.stringify(e));
    console.log('Parameters:', JSON.stringify(e.parameter));

    // Debug: log each field
    console.log('fullName:', e.parameter.fullName);
    console.log('email:', e.parameter.email);
    console.log('company:', e.parameter.company);
    console.log('phone:', e.parameter.phone);
    console.log('message:', e.parameter.message);
    
    const spreadsheetId = '10_A-JgSdqO13UfuV3qk78Z-1ldESZFcRLWSu32-RhnE';
    
    let spreadsheet;
    try {
      spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    } catch (sheetError) {
      console.error('Cannot access spreadsheet:', sheetError);
      throw new Error('Spreadsheet not accessible. Please check the ID and permissions.');
    }
    
    const sheet = spreadsheet.getSheetByName("Kalpvruksh"); // Correct usage
    if (!sheet) throw new Error('Sheet "Kalpvruksh" not found.');

    const data = e.parameter;

    sheet.appendRow([
      new Date(),
      data.fullName,
      data.email,
      data.company,
      data.phone,
      data.message
    ]);

    // Return JSON with CORS
    return ContentService.createTextOutput(
      JSON.stringify({ result: "success" })
    )
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin","*");

  } catch (error) {
    console.error('Error in doPost:', error);
    return ContentService.createTextOutput(
      JSON.stringify({ result: "error", message: error.message })
    )
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*");
  }
}
