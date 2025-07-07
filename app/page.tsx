"use client";
import Hero from '@/components/Hero'
import Header from '@/components/Header'
import Features from '@/components/Features'
import SuccessStories from '@/components/SuccessStories'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Features />
      <SuccessStories />
      <CTA />
      <Footer />
    </main>
  )
}