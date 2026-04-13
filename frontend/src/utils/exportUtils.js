/**
 * Utility functions for exporting data as CSV files
 */

/**
 * Downloads CSV data from an API endpoint as a file.
 * @param {Function} apiCall - async function that returns blob data
 * @param {string} filename - name for the downloaded file
 * @param {Function} onSuccess - optional callback on successful export
 * @param {Function} onError - optional callback on error, receives error message
 */
export const downloadCsv = async (apiCall, filename, onSuccess, onError) => {
    try {
        const response = await apiCall();
        const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = filename;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        URL.revokeObjectURL(url);
        
        if (onSuccess) {
            onSuccess();
        }
    } catch (err) {
        console.error(`Failed to export ${filename}`, err);
        const errorMsg = `Unable to export ${filename}. Please try again.`;
        if (onError) {
            onError(errorMsg);
        }
    }
};
