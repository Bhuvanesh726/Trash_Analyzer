import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

/**
 * Generates industrial insights based on waste metrics.
 */
export function getIndustrialInsights(targetRecords) {
    let p = 0, pl = 0, w = 0, o = 0, d = 0
    targetRecords.forEach(r => {
        p += (r.paper || 0); pl += (r.plastic || 0); w += (r.wet || 0);
        o += (r.organic || 0); d += (r.defective || 0)
    })

    const insights = ["Analysis Results and Recommendations:"]
    if (p > 5) insights.push(`• PAPER WASTE DETECTED (${p.toFixed(1)}kg): Audit current manufacturing process for material overflow. Divert all paper waste to designated recycling stations immediately.`)
    if (pl > 5) insights.push(`• PLASTIC LOAD DETECTED (${pl.toFixed(1)}kg): Check packaging line for alignment errors. Send scrap to high-density granulation unit for recovery.`)
    if (w > 5) insights.push(`• WET WASTE ALERT (${w.toFixed(1)}kg): Verify liquid containment seals on the plant floor. Transfer for bio-hazard processing within 12 hours.`)
    if (o > 5) insights.push(`• ORGANIC RECOVERY (${o.toFixed(1)}kg): Increase cleanup frequency in production zones. Schedule composting plant pickup.`)
    if (d > 2) insights.push(`• CRITICAL DEFECTS (${d.toFixed(1)}kg): Calibrate machine sensors immediately. Quality threshold exceeded - halt current SKU batch for inspection.`)

    if (insights.length === 1) insights.push("• Minimal waste detected. Operations within optimal efficiency parameters. Keep up the lean manufacturing practices.")

    return insights.join('\n\n')
}

/**
 * Generates a premium PDF report with charts and insights.
 */
export function generatePDF(records, industrialInsights) {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()

    // --- Header ---
    doc.setFillColor(255, 107, 0)
    doc.rect(0, 0, pageWidth, 40, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('TRASHILIZER', 14, 22)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Industrial Waste & Sustainability Report', 14, 32)
    doc.text(`DATE: ${new Date().toLocaleDateString()}`, pageWidth - 14, 32, { align: 'right' })

    // --- Stats Summary Cards ---
    let p = 0, pl = 0, w = 0, o = 0, d = 0
    records.forEach(r => {
        p += (r.paper || 0);
        pl += (r.plastic || 0);
        w += (r.wet || 0);
        o += (r.organic || 0);
        d += (r.defective || 0)
    })
    const total = p + pl + w + o + d
    const recyclerRatio = total > 0 ? ((p + pl) / total) * 100 : 0

    let y = 55
    doc.setTextColor(30, 30, 50)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('Plant Metrics Summary', 14, y)
    y += 10

    doc.setDrawColor(230, 230, 230)
    doc.setFillColor(249, 250, 251)

    const cardWidth = (pageWidth - 40) / 3
    // Card 1: TOTAL WASTE
    doc.setFillColor(255, 255, 255)
    doc.setDrawColor(230, 230, 230)
    doc.rect(14, y, cardWidth, 25, 'FD')
    doc.setDrawColor(255, 107, 0) // Orange top accent
    doc.line(14, y, 14 + cardWidth, y)

    doc.setTextColor(100, 100, 100)
    doc.setFontSize(8)
    doc.text('TOTAL WASTE', 18, y + 8)
    doc.setTextColor(255, 107, 0)
    doc.setFontSize(14)
    doc.text(`${total.toFixed(1)} kg`, 18, y + 18)

    // Card 2: RECORDS
    doc.setFillColor(255, 255, 255)
    doc.setDrawColor(230, 230, 230)
    doc.rect(14 + cardWidth + 6, y, cardWidth, 25, 'FD')
    doc.setDrawColor(59, 130, 246) // Blue top accent
    doc.line(14 + cardWidth + 6, y, 14 + cardWidth + 6 + cardWidth, y)

    doc.setTextColor(100, 100, 100)
    doc.setFontSize(8)
    doc.text('RECORDS', 18 + cardWidth + 6, y + 8)
    doc.setTextColor(59, 130, 246)
    doc.setFontSize(14)
    doc.text(`${records.length} Units`, 18 + cardWidth + 6, y + 18)

    // Card 3: RECYCLABILITY
    doc.setFillColor(255, 255, 255)
    doc.setDrawColor(230, 230, 230)
    doc.rect(14 + (cardWidth + 6) * 2, y, cardWidth, 25, 'FD')
    doc.setDrawColor(34, 197, 94) // Green top accent
    doc.line(14 + (cardWidth + 6) * 2, y, 14 + (cardWidth + 6) * 2 + cardWidth, y)

    doc.setTextColor(100, 100, 100)
    doc.setFontSize(8)
    doc.text('RECYCLABILITY', 18 + (cardWidth + 6) * 2, y + 8)
    doc.setTextColor(16, 185, 129)
    doc.setFontSize(14)
    doc.text(`${recyclerRatio.toFixed(1)}%`, 18 + (cardWidth + 6) * 2, y + 18)

    y += 35

    // --- Visual: Distribution ---
    doc.setTextColor(30, 30, 50)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Waste Distribution Profile', 14, y)
    y += 10

    const categories = [
        { name: 'Paper', val: p, color: [255, 107, 0] },
        { name: 'Plastic', val: pl, color: [59, 130, 246] },
        { name: 'Wet', val: w, color: [16, 185, 129] },
        { name: 'Organic', val: o, color: [139, 92, 246] },
        { name: 'Defect', val: d, color: [239, 68, 68] }
    ]

    const chartMaxHeight = 40
    const maxVal = Math.max(...categories.map(c => c.val), 1)

    categories.forEach((cat, idx) => {
        const barX = 14 + (idx * 38)
        const barHeight = (cat.val / maxVal) * chartMaxHeight
        doc.setTextColor(100, 100, 100)
        doc.setFontSize(8)
        doc.text(cat.name, barX, y + chartMaxHeight + 5)
        doc.text(`${cat.val.toFixed(1)}kg`, barX, y + chartMaxHeight + 10)
        doc.setFillColor(...cat.color)
        doc.rect(barX, y + (chartMaxHeight - barHeight), 25, barHeight, 'F')
    })

    y += 65

    // --- Table ---
    doc.setTextColor(30, 30, 50)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Production Waste Audit Log', 14, y)
    y += 5

    const tableBody = records.map((r, i) => [
        r.skuId || `BATCH-${i + 1}`,
        r.paper?.toFixed(1) || '0.0',
        r.plastic?.toFixed(1) || '0.0',
        r.wet?.toFixed(1) || '0.0',
        r.organic?.toFixed(1) || '0.0',
        r.defective?.toFixed(1) || '0.0',
        ((r.paper || 0) + (r.plastic || 0) + (r.wet || 0) + (r.organic || 0) + (r.defective || 0)).toFixed(1),
    ])

    autoTable(doc, {
        startY: y,
        head: [['SKU ID', 'Paper', 'Plastic', 'Wet', 'Organic', 'Defects', 'Total']],
        body: tableBody,
        theme: 'grid',
        headStyles: { fillColor: [30, 30, 50], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
        bodyStyles: { fontSize: 8 },
        alternateRowStyles: { fillColor: [250, 250, 250] },
    })

    y = doc.lastAutoTable.finalY + 15

    // --- Section: Insights ---
    if (y > 230) { doc.addPage(); y = 20 }

    // White background for pure clarity
    doc.setFillColor(255, 255, 255)
    doc.rect(14, y, pageWidth - 28, 70, 'F')

    // Sophisticated light border
    doc.setDrawColor(230, 230, 230)
    doc.setLineWidth(0.2)
    doc.rect(14, y, pageWidth - 28, 70, 'D')

    // Industrial orange accent line
    doc.setDrawColor(255, 107, 0)
    doc.setLineWidth(1.5)
    doc.line(14, y, 14, y + 70)

    doc.setTextColor(255, 107, 0)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Industrial Insights & Recommendations', 20, y + 10)

    y += 18
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0) // Pure black for text as requested

    const insightLines = doc.splitTextToSize(industrialInsights || 'Operational metrics within optimal parameters.', pageWidth - 40)
    insightLines.forEach(line => {
        if (y > 275) { doc.addPage(); y = 20 }
        doc.text(line, 20, y)
        y += 5
    })

    // --- Footer ---
    const totalPages = doc.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(180, 180, 180)
        doc.text('TRASHILIZER | COMPLIANCE REPORT | CONFIDENTIAL', 14, doc.internal.pageSize.getHeight() - 10)
        doc.text(`PAGE ${i} / ${totalPages}`, pageWidth - 14, doc.internal.pageSize.getHeight() - 10, { align: 'right' })
    }

    doc.save(`Trashilizer_Audit_${records[0]?.skuId || 'Global'}_${new Date().toISOString().slice(0, 10)}.pdf`)
}
