package com.lifehub.util;

public class CsvUtils {
    
    /**
     * Escapes CSV field values according to RFC 4180.
     * Surrounds the value with quotes if it contains commas, quotes, or newlines.
     * Quotes within values are escaped by doubling them.
     *
     * @param value the raw CSV field value
     * @return the escaped CSV field value
     */
    public static String escapeCsv(String value) {
        if (value == null) {
            return "";
        }
        String escaped = value.replace("\"", "\"\"");
        return escaped.contains(",") || escaped.contains("\"") || escaped.contains("\n")
                ? "\"" + escaped + "\""
                : escaped;
    }
}
