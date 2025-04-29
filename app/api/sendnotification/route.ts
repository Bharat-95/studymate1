// app/api/sendnotification/route.ts

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  const body = await req.json();
  const { playerIds, title, message, groupId } = body;

  if (!playerIds || !title || !message) {
    return NextResponse.json({ message: 'Missing parameters' }, { status: 400 });
  }

  try {
    const response = await axios.post('https://onesignal.com/api/v1/notifications', {
      app_id: process.env.ONESIGNAL_APP_ID,
      include_player_ids: playerIds,
      headings: { en: title },
      contents: { en: message },
      data: { groupId },
    }, {
      headers: {
        Authorization: `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('OneSignal Response:', response.data);
    return NextResponse.json({ message: 'Notification Sent', data: response.data }, { status: 200 });

  } catch (error: any) {
    console.error('Notification Error:', error.response?.data || error.message);
    return NextResponse.json({ message: 'Failed to send notification', error: error.response?.data || error.message }, { status: 500 });
  }
}


export async function GET() {
    return NextResponse.json({ message: 'API is online and ready' }, { status: 200 });
  }