import type { AppProps } from 'next/app'
import Head from 'next/head'
import Script from 'next/script'
import '../styles/globals.css'
import ChatWidget from '../components/ChatWidget'
import { SUPPORT } from '../lib/support.config'

const UMAMI_ID = process.env.NEXT_PUBLIC_UMAMI_ID
const UMAMI_URL = (process.env.NEXT_PUBLIC_UMAMI_URL || 'https://analytics.umami.is').replace(/\/$/, '')

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {UMAMI_ID && (
        <Script
          async
          src={`${UMAMI_URL}/script.js`}
          data-website-id={UMAMI_ID}
          strategy="afterInteractive"
        />
      )}
            <><Head>
        <meta property="og:type" content="website" />
        <meta property="og:title" content="SaaSpend" />
        <meta property="og:description" content="List your team's SaaS tools (one per line with monthly cost); get a spend audit that flags duplicate categories, forgotten tools, and a suggested savings number. For SMB ops and finance managers tracking tool sprawl." />
        <meta property="og:url" content="https://saaspend.lxsaihub.com/" />
        <meta property="og:image" content="https://saaspend.lxsaihub.com/og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SaaSpend" />
        <meta name="twitter:description" content="List your team's SaaS tools (one per line with monthly cost); get a spend audit that flags duplicate categories, forgotten tools, and a suggested savings number. For SMB ops and finance managers tracking tool sprawl." />
        <meta name="twitter:image" content="https://saaspend.lxsaihub.com/og.png" />
                                        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: '{"@context":"https://schema.org","@type":"SoftwareApplication","name":"SaaSpend","url":"https://saaspend.lxsaihub.com/","description":"List your team\'s SaaS tools (one per line with monthly cost); get a spend audit that flags duplicate categories, forgotten tools, and a suggested savings number. For SMB ops and finance managers tracking tool sprawl.","applicationCategory":"BusinessApplication","operatingSystem":"Web","offers":{"@type":"Offer","priceCurrency":"USD","price":"0","availability":"https://schema.org/OnlineOnly"}}' }} />
      </Head>
      <Component {...pageProps} />
      <ChatWidget productName={SUPPORT.productName} brandColor={SUPPORT.brandColor} sessionKeyPrefix={SUPPORT.productSlug} /></>
    </>
  )
}
