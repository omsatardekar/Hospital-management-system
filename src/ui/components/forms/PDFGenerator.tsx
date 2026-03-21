import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export interface PDFGenerationOptions {
  filename: string
  format?: 'a4' | 'letter'
  orientation?: 'portrait' | 'landscape'
  scale?: number
  quality?: number
}

export class PDFGenerator {
  private static instance: PDFGenerator

  static getInstance(): PDFGenerator {
    if (!PDFGenerator.instance) {
      PDFGenerator.instance = new PDFGenerator()
    }
    return PDFGenerator.instance
  }

  async generateFromElement(
    element: HTMLElement,
    options: PDFGenerationOptions
  ): Promise<void> {
    const {
      filename,
      format = 'a4',
      orientation = 'portrait',
      scale = 2,
      quality = 0.95,
    } = options

    try {
      // Show loading state
      const loadingElement = document.createElement('div')
      loadingElement.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px 40px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 10000;
        font-family: system-ui;
        font-size: 14px;
      `
      loadingElement.textContent = 'Generating PDF...'
      document.body.appendChild(loadingElement)

      // Create canvas from element
      const canvas = await html2canvas(element, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      })

      // Get canvas dimensions
      const imgData = canvas.toDataURL('image/png', quality)
      const imgWidth = canvas.width
      const imgHeight = canvas.height

      // Calculate PDF dimensions
      let pdfWidth: number, pdfHeight: number
      if (format === 'a4') {
        pdfWidth = 210 // mm
        pdfHeight = 297 // mm
      } else {
        pdfWidth = 216 // mm (letter width)
        pdfHeight = 279 // mm (letter height)
      }

      // Swap dimensions for landscape
      if (orientation === 'landscape') {
        ;[pdfWidth, pdfHeight] = [pdfHeight, pdfWidth]
      }

      // Create PDF
      const pdf = new jsPDF({
        orientation,
        unit: 'mm',
        format,
      })

      // Calculate image dimensions to fit PDF
      const ratio = Math.min(pdfWidth / (imgWidth * 0.264583), pdfHeight / (imgHeight * 0.264583))
      const finalImgWidth = imgWidth * 0.264583 * ratio
      const finalImgHeight = imgHeight * 0.264583 * ratio

      // Add image to PDF
      const x = (pdfWidth - finalImgWidth) / 2
      const y = 10 // 10mm margin from top

      pdf.addImage(imgData, 'PNG', x, y, finalImgWidth, finalImgHeight)

      // Save PDF
      pdf.save(filename)

      // Remove loading element
      document.body.removeChild(loadingElement)
    } catch (error) {
      console.error('Error generating PDF:', error)
      throw new Error('Failed to generate PDF. Please try again.')
    }
  }

  async generateInvoicePDF(
    invoiceData: any,
    options: PDFGenerationOptions
  ): Promise<void> {
    // Create a temporary container for the invoice
    const container = document.createElement('div')
    container.style.cssText = `
      position: absolute;
      left: -9999px;
      top: -9999px;
      width: 210mm;
      background: white;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      padding: 20mm;
      box-sizing: border-box;
    `

    // Generate invoice HTML
    container.innerHTML = this.generateInvoiceHTML(invoiceData)
    document.body.appendChild(container)

    try {
      await this.generateFromElement(container, options)
    } finally {
      // Clean up
      document.body.removeChild(container)
    }
  }

  async generateLabReportPDF(
    reportData: any,
    options: PDFGenerationOptions
  ): Promise<void> {
    // Create a temporary container for the lab report
    const container = document.createElement('div')
    container.style.cssText = `
      position: absolute;
      left: -9999px;
      top: -9999px;
      width: 210mm;
      background: white;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      padding: 20mm;
      box-sizing: border-box;
    `

    // Generate lab report HTML
    container.innerHTML = this.generateLabReportHTML(reportData)
    document.body.appendChild(container)

    try {
      await this.generateFromElement(container, options)
    } finally {
      // Clean up
      document.body.removeChild(container)
    }
  }

  private generateInvoiceHTML(data: any): string {
    return `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; border-bottom: 2px solid #1976d2; padding-bottom: 20px;">
          <div>
            <h1 style="color: #1976d2; margin: 0; font-size: 28px; font-weight: 700;">HMS Hospital</h1>
            <p style="margin: 5px 0; color: #666; font-size: 14px;">123 Medical Center Drive</p>
            <p style="margin: 5px 0; color: #666; font-size: 14px;">City, State 12345</p>
            <p style="margin: 5px 0; color: #666; font-size: 14px;">Phone: (555) 123-4567</p>
          </div>
          <div style="text-align: right;">
            <h2 style="color: #333; margin: 0; font-size: 24px; font-weight: 600;">INVOICE</h2>
            <p style="margin: 5px 0; color: #666; font-size: 14px;">Invoice #: ${data.invoiceNumber || 'INV-001'}</p>
            <p style="margin: 5px 0; color: #666; font-size: 14px;">Date: ${new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <!-- Patient Information -->
        <div style="margin-bottom: 30px;">
          <h3 style="color: #1976d2; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">Patient Information</h3>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
            <p style="margin: 5px 0; font-size: 14px;"><strong>Name:</strong> ${data.patientName || 'John Doe'}</p>
            <p style="margin: 5px 0; font-size: 14px;"><strong>ID:</strong> ${data.patientId || 'P-001'}</p>
            <p style="margin: 5px 0; font-size: 14px;"><strong>Phone:</strong> ${data.patientPhone || '(555) 123-4567'}</p>
          </div>
        </div>

        <!-- Services -->
        <div style="margin-bottom: 30px;">
          <h3 style="color: #1976d2; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">Services & Charges</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background: #1976d2; color: white;">
                <th style="padding: 12px; text-align: left; font-size: 14px; border: 1px solid #ddd;">Description</th>
                <th style="padding: 12px; text-align: center; font-size: 14px; border: 1px solid #ddd;">Quantity</th>
                <th style="padding: 12px; text-align: right; font-size: 14px; border: 1px solid #ddd;">Unit Price</th>
                <th style="padding: 12px; text-align: right; font-size: 14px; border: 1px solid #ddd;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${data.services?.map((service: any) => `
                <tr>
                  <td style="padding: 12px; border: 1px solid #ddd; font-size: 14px;">${service.description}</td>
                  <td style="padding: 12px; text-align: center; border: 1px solid #ddd; font-size: 14px;">${service.quantity}</td>
                  <td style="padding: 12px; text-align: right; border: 1px solid #ddd; font-size: 14px;">$${service.unitPrice.toFixed(2)}</td>
                  <td style="padding: 12px; text-align: right; border: 1px solid #ddd; font-size: 14px; font-weight: 600;">$${service.total.toFixed(2)}</td>
                </tr>
              `).join('') || `
                <tr>
                  <td style="padding: 12px; border: 1px solid #ddd; font-size: 14px;">Consultation Fee</td>
                  <td style="padding: 12px; text-align: center; border: 1px solid #ddd; font-size: 14px;">1</td>
                  <td style="padding: 12px; text-align: right; border: 1px solid #ddd; font-size: 14px;">$150.00</td>
                  <td style="padding: 12px; text-align: right; border: 1px solid #ddd; font-size: 14px; font-weight: 600;">$150.00</td>
                </tr>
              `}
            </tbody>
          </table>
        </div>

        <!-- Summary -->
        <div style="text-align: right; margin-bottom: 30px;">
          <div style="display: inline-block; text-align: right;">
            <p style="margin: 5px 0; font-size: 14px;"><strong>Subtotal:</strong> $${data.subtotal || '150.00'}</p>
            <p style="margin: 5px 0; font-size: 14px;"><strong>Tax (10%):</strong> $${data.tax || '15.00'}</p>
            <p style="margin: 10px 0; font-size: 18px; color: #1976d2; font-weight: 700;"><strong>Total:</strong> $${data.total || '165.00'}</p>
          </div>
        </div>

        <!-- Footer -->
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center;">
          <p style="margin: 5px 0; color: #666; font-size: 12px;">Thank you for choosing HMS Hospital</p>
          <p style="margin: 5px 0; color: #666; font-size: 12px;">This is a computer-generated invoice and does not require a signature</p>
        </div>
      </div>
    `
  }

  private generateLabReportHTML(data: any): string {
    return `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #1976d2; padding-bottom: 20px;">
          <h1 style="color: #1976d2; margin: 0; font-size: 28px; font-weight: 700;">HMS Hospital</h1>
          <h2 style="color: #333; margin: 10px 0; font-size: 22px; font-weight: 600;">Laboratory Report</h2>
          <p style="margin: 5px 0; color: #666; font-size: 14px;">123 Medical Center Drive, City, State 12345</p>
          <p style="margin: 5px 0; color: #666; font-size: 14px;">Phone: (555) 123-4567</p>
        </div>

        <!-- Patient Information -->
        <div style="margin-bottom: 30px;">
          <h3 style="color: #1976d2; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">Patient Information</h3>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
            <p style="margin: 5px 0; font-size: 14px;"><strong>Name:</strong> ${data.patientName || 'John Doe'}</p>
            <p style="margin: 5px 0; font-size: 14px;"><strong>ID:</strong> ${data.patientId || 'P-001'}</p>
            <p style="margin: 5px 0; font-size: 14px;"><strong>Age:</strong> ${data.patientAge || '35'}</p>
            <p style="margin: 5px 0; font-size: 14px;"><strong>Gender:</strong> ${data.patientGender || 'Male'}</p>
            <p style="margin: 5px 0; font-size: 14px;"><strong>Test Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <!-- Test Results -->
        <div style="margin-bottom: 30px;">
          <h3 style="color: #1976d2; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">Test Results</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background: #1976d2; color: white;">
                <th style="padding: 12px; text-align: left; font-size: 14px; border: 1px solid #ddd;">Test Name</th>
                <th style="padding: 12px; text-align: center; font-size: 14px; border: 1px solid #ddd;">Result</th>
                <th style="padding: 12px; text-align: center; font-size: 14px; border: 1px solid #ddd;">Normal Range</th>
                <th style="padding: 12px; text-align: center; font-size: 14px; border: 1px solid #ddd;">Unit</th>
                <th style="padding: 12px; text-align: center; font-size: 14px; border: 1px solid #ddd;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${data.tests?.map((test: any) => `
                <tr>
                  <td style="padding: 12px; border: 1px solid #ddd; font-size: 14px;">${test.name}</td>
                  <td style="padding: 12px; text-align: center; border: 1px solid #ddd; font-size: 14px; font-weight: 600;">${test.result}</td>
                  <td style="padding: 12px; text-align: center; border: 1px solid #ddd; font-size: 14px;">${test.normalRange}</td>
                  <td style="padding: 12px; text-align: center; border: 1px solid #ddd; font-size: 14px;">${test.unit}</td>
                  <td style="padding: 12px; text-align: center; border: 1px solid #ddd; font-size: 14px;">
                    <span style="background: ${test.status === 'Normal' ? '#4caf50' : '#ff9800'}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
                      ${test.status}
                    </span>
                  </td>
                </tr>
              `).join('') || `
                <tr>
                  <td style="padding: 12px; border: 1px solid #ddd; font-size: 14px;">Complete Blood Count</td>
                  <td style="padding: 12px; text-align: center; border: 1px solid #ddd; font-size: 14px; font-weight: 600;">4.5</td>
                  <td style="padding: 12px; text-align: center; border: 1px solid #ddd; font-size: 14px;">4.5-11.0</td>
                  <td style="padding: 12px; text-align: center; border: 1px solid #ddd; font-size: 14px;">million/μL</td>
                  <td style="padding: 12px; text-align: center; border: 1px solid #ddd; font-size: 14px;">
                    <span style="background: #4caf50; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">Normal</span>
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>

        <!-- Remarks -->
        <div style="margin-bottom: 30px;">
          <h3 style="color: #1976d2; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">Remarks</h3>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
            <p style="margin: 0; font-size: 14px; line-height: 1.5;">
              ${data.remarks || 'All test results are within normal ranges. No abnormalities detected.'}
            </p>
          </div>
        </div>

        <!-- Doctor Signature -->
        <div style="margin-top: 40px; display: flex; justify-content: space-between;">
          <div style="text-align: center;">
            <div style="border-bottom: 1px solid #333; width: 200px; margin-bottom: 5px;"></div>
            <p style="margin: 5px 0; font-size: 14px; font-weight: 600;">Dr. ${data.doctorName || 'John Smith'}</p>
            <p style="margin: 5px 0; font-size: 12px; color: #666;">Pathologist</p>
          </div>
          <div style="text-align: center;">
            <p style="margin: 5px 0; font-size: 14px; color: #666;">Report Date: ${new Date().toLocaleDateString()}</p>
            <p style="margin: 5px 0; font-size: 14px; color: #666;">Report ID: ${data.reportId || 'LAB-001'}</p>
          </div>
        </div>
      </div>
    `
  }
}

export const pdfGenerator = PDFGenerator.getInstance()
