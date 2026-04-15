import { NextRequest, NextResponse } from 'next/server';
import Tesseract from 'tesseract.js';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Convert file to base64 for Tesseract
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');
    const imageUrl = `data:${imageFile.type};base64,${base64Image}`;

    // Extract text using Tesseract.js
    const { data: { text } } = await Tesseract.recognize(
      imageUrl,
      'eng',
      {
        logger: (m) => {
          // Optional: track progress
          if (m.status === 'recognizing text') {
            console.log(`Progress: ${Math.round(m.progress * 100)}%`);
          }
        }
      }
    );

    // Define Muntinlupa keywords (comprehensive list)
    const muntinlupaKeywords = [
      // City name
      'Muntinlupa', 'Muntinlupa City', 'City of Muntinlupa',
      
      // Barangays in Muntinlupa
      'Bayanan', 'Barangay Bayanan', 'Brgy. Bayanan',
      'Alabang', 'Ayala Alabang',
      'Sucat', 'San Isidro',
      'Tunasan',
      'Poblacion',
      'Putatan',
      'Buli',
      'Cupang',
      
      // Landmarks
      'Muntinlupa City Hall', 'Muntinlupa Sports Center',
      'Alabang Town Center', 'Festival Mall',
      'South Luzon Expressway', 'SLEX',
      
      // Address patterns
      'Muntinlupa', '1770', '1771', '1772', '1773', '1774', '1775' // ZIP codes
    ];

    // Check if text contains Muntinlupa keywords
    const lowerText = text.toLowerCase();
    const foundKeywords = muntinlupaKeywords.filter(keyword =>
      lowerText.includes(keyword.toLowerCase())
    );

    const isFromMuntinlupa = foundKeywords.length > 0;

    // Extract address from text
    const addressPatterns = [
      /(\d+)\s+([\w\s]+(?:Street|St\.|Avenue|Ave\.|Road|Rd\.|Barangay|Brgy\.))/i,
      /(?:Barangay|Brgy\.)\s+([\w\s]+)/i,
      /([\w\s]+)\s+Muntinlupa/i
    ];

    let detectedAddress = null;
    for (const pattern of addressPatterns) {
      const match = text.match(pattern);
      if (match) {
        detectedAddress = match[0];
        break;
      }
    }

    // Calculate confidence score
    const confidence = Math.min((foundKeywords.length / 5) * 100, 100);

    return NextResponse.json({
      success: true,
      isFromMuntinlupa,
      confidence,
      extractedText: text.substring(0, 500), // First 500 chars
      detectedAddress,
      foundKeywords: foundKeywords.slice(0, 5), // Top 5 found keywords
      requiresManualReview: confidence < 50
    });

  } catch (error: any) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { 
        error: 'Verification failed',
        isFromMuntinlupa: false,
        requiresManualReview: true
      },
      { status: 500 }
    );
  }
}