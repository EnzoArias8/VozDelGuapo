import { NextRequest, NextResponse } from 'next/server'
import { mockMatches } from '@/lib/mock-data'

// In a real app, this would come from a database
let matches = [...mockMatches]

export async function GET() {
  return NextResponse.json(matches)
}

export async function POST(request: NextRequest) {
  try {
    const match = await request.json()
    
    // Validate required fields
    if (!match.home || !match.away || !match.date || !match.tournament || !match.stadium) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Add new match with generated ID
    const newMatch = {
      id: Date.now().toString(),
      ...match,
      status: match.status || 'upcoming'
    }

    matches.push(newMatch)
    return NextResponse.json(newMatch, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updatedMatch = await request.json()
    
    if (!updatedMatch.id) {
      return NextResponse.json(
        { error: 'Match ID is required' },
        { status: 400 }
      )
    }

    const index = matches.findIndex(m => m.id === updatedMatch.id)
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }

    matches[index] = { ...matches[index], ...updatedMatch }
    return NextResponse.json(matches[index])
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Match ID is required' },
        { status: 400 }
      )
    }

    const index = matches.findIndex(m => m.id === id)
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }

    matches.splice(index, 1)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}
