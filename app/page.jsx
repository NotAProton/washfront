'use client'
import { redirect } from 'next/navigation'
export default function Home () {
  redirect('/status')
  return (
    <div>Redirecting...</div>
  )
}
