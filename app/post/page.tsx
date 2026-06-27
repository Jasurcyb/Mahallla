import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PostServiceForm } from '@/components/post-service-form'

export default function PostPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-semibold text-foreground text-balance">
            Offer a service to your mahalla
          </h1>
          <p className="mt-2 text-muted-foreground text-pretty">
            Share your skills with neighbors. Our AI helps you set a fair price
            for your area in seconds.
          </p>
        </div>
        <PostServiceForm />
      </main>
      <SiteFooter />
    </div>
  )
}
