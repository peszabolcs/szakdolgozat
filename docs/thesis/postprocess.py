#!/usr/bin/env python3
"""
Post-process the pandoc-generated docx:
  1. Insert a real Word TOC field after the "Tartalmi összefoglaló" section.
  2. Add visible borders to every table.

Usage:
    python3 postprocess.py szakdolgozat_v0.1.docx
"""

import sys
import re
import shutil
import zipfile
from pathlib import Path

INPUT = Path(sys.argv[1] if len(sys.argv) > 1 else "szakdolgozat_v0.1.docx").resolve()
OUTPUT = INPUT.with_name(INPUT.stem + "_processed.docx")

# Word XML namespace
W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"

TOC_FIELD_XML = (
    '<w:p xmlns:w="' + W + '">'
    '<w:pPr><w:pStyle w:val="Heading1"/></w:pPr>'
    '<w:r><w:t>Tartalomjegyzék</w:t></w:r>'
    '</w:p>'
    '<w:p xmlns:w="' + W + '">'
    '<w:r>'
    '<w:fldChar w:fldCharType="begin" w:dirty="true"/>'
    '</w:r>'
    '<w:r>'
    '<w:instrText xml:space="preserve">TOC \\o &quot;1-3&quot; \\h \\z \\u</w:instrText>'
    '</w:r>'
    '<w:r>'
    '<w:fldChar w:fldCharType="separate"/>'
    '</w:r>'
    '<w:r>'
    '<w:t xml:space="preserve">A tartalomjegyzék frissítéséhez kattints jobb gombbal és válaszd: Update Field.</w:t>'
    '</w:r>'
    '<w:r>'
    '<w:fldChar w:fldCharType="end"/>'
    '</w:r>'
    '</w:p>'
    '<w:p xmlns:w="' + W + '">'
    '<w:r><w:br w:type="page"/></w:r>'
    '</w:p>'
)

TABLE_BORDERS_XML = (
    '<w:tblBorders xmlns:w="' + W + '">'
    '<w:top w:val="single" w:sz="6" w:space="0" w:color="000000"/>'
    '<w:left w:val="single" w:sz="6" w:space="0" w:color="000000"/>'
    '<w:bottom w:val="single" w:sz="6" w:space="0" w:color="000000"/>'
    '<w:right w:val="single" w:sz="6" w:space="0" w:color="000000"/>'
    '<w:insideH w:val="single" w:sz="6" w:space="0" w:color="000000"/>'
    '<w:insideV w:val="single" w:sz="6" w:space="0" w:color="000000"/>'
    '</w:tblBorders>'
)


def insert_toc_field(doc_xml: str) -> str:
    """Insert a Word TOC field paragraph BEFORE the first heading that says 'Bevezetés'."""
    pattern = re.compile(
        r'(<w:p[^>]*>(?:(?!</w:p>).)*Bevezet[^<]*</w:t>(?:(?!</w:p>).)*</w:p>)',
        re.DOTALL,
    )
    match = pattern.search(doc_xml)
    if not match:
        print("WARNING: 'Bevezetés' heading not found — TOC NOT inserted.")
        return doc_xml
    insertion_point = match.start()
    return doc_xml[:insertion_point] + TOC_FIELD_XML + doc_xml[insertion_point:]


def add_table_borders(doc_xml: str) -> str:
    """For every <w:tbl>, ensure that <w:tblPr> contains <w:tblBorders> with single-line borders."""
    def replace_tblpr(match: re.Match) -> str:
        tblpr_block = match.group(0)
        if "<w:tblBorders" in tblpr_block:
            return tblpr_block
        # Insert borders inside tblPr
        return tblpr_block.replace(
            "</w:tblPr>",
            TABLE_BORDERS_XML + "</w:tblPr>",
        )

    return re.sub(r"<w:tblPr[^>]*>.*?</w:tblPr>", replace_tblpr, doc_xml, flags=re.DOTALL)


def main() -> None:
    if not INPUT.exists():
        print(f"ERROR: input file not found: {INPUT}")
        sys.exit(1)

    print(f"Reading: {INPUT}")
    with zipfile.ZipFile(INPUT, "r") as z:
        names = z.namelist()
        document_xml = z.read("word/document.xml").decode("utf-8")
        other_files = {n: z.read(n) for n in names if n != "word/document.xml"}

    print("Inserting TOC field...")
    document_xml = insert_toc_field(document_xml)

    print("Adding table borders...")
    table_count_before = document_xml.count("<w:tbl ") + document_xml.count("<w:tbl>")
    document_xml = add_table_borders(document_xml)
    print(f"  -> processed {table_count_before} tables")

    print(f"Writing: {OUTPUT}")
    with zipfile.ZipFile(OUTPUT, "w", zipfile.ZIP_DEFLATED) as z:
        for name, data in other_files.items():
            z.writestr(name, data)
        z.writestr("word/document.xml", document_xml)

    print("Done.")
    # Replace the original file
    shutil.move(OUTPUT, INPUT)
    print(f"Replaced original: {INPUT}")


if __name__ == "__main__":
    main()
