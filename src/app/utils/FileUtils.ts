export class FileUtils {

  static createAndDownloadFile(jsonString: string, fileName: string) {
    const blob = new Blob([jsonString], { type: 'application/json' }); // Create a Blob from the JSON string
    const url = URL.createObjectURL(blob); // Create a URL for the Blob

    // Create a temporary <a> element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName; // Set the file name with .json extension
    a.click(); // Programmatically trigger the download

    // Cleanup: Remove the <a> element and release the object URL
    URL.revokeObjectURL(url);
  }
}
