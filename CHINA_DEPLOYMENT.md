# China Mainland Deployment

Vercel is convenient, but access from mainland China can be unstable. The Hexo site is static, so the recommended mainland-friendly setup is:

```text
Hexo build -> Tencent COS static files -> Tencent CDN -> ICP-filed custom domain
```

This keeps the current Vercel deployment for overseas access and adds a separate China endpoint.

## Recommended Option: Tencent COS + CDN

You need:

- A domain, for example `example.com`
- A Tencent Cloud account
- A Tencent COS bucket
- ICP filing if you use a mainland China region and custom domain
- A Tencent CAM access key with COS upload permissions

Tencent Cloud COS supports static website hosting. For stable public access in mainland China, bind a custom CDN acceleration domain and configure DNS CNAME. If the acceleration domain uses mainland China service, ICP filing is required.

## Create COS Bucket

1. Open Tencent Cloud Console -> COS.
2. Create a bucket, for example:

   ```text
   my-blog-1250000000
   ```

3. Choose a mainland region:

   ```text
   ap-guangzhou
   ap-shanghai
   ap-beijing
   ```

4. Enable static website hosting:

   ```text
   index document: index.html
   error document: 404.html
   ```

5. For production, prefer private read/write plus CDN access control. For a quick first test, public read/private write is easier.

## Bind Domain

Recommended public domain:

```text
www.example.com
```

Steps:

1. Complete ICP filing for the domain if using mainland China CDN/COS.
2. Add a CDN acceleration domain in Tencent Cloud.
3. Set origin to the COS bucket.
4. Add the CNAME record in your DNS provider.
5. Enable HTTPS certificate.

## GitHub Secrets

This repo now includes:

```text
.github/workflows/deploy-hexo-tencent-cos.yml
```

Add these secrets in GitHub:

```text
Settings -> Secrets and variables -> Actions -> New repository secret
```

Required secrets:

```text
TENCENT_SECRET_ID=
TENCENT_SECRET_KEY=
TENCENT_COS_BUCKET=
TENCENT_COS_REGION=
```

Example:

```text
TENCENT_COS_BUCKET=my-blog-1250000000
TENCENT_COS_REGION=ap-guangzhou
```

Never commit real keys.

## Deploy

Open GitHub Actions and run:

```text
Deploy Hexo Blog to Tencent COS
```

The workflow runs:

```bash
cd hexo-blog
npm install
npm run build
coscmd upload -rs --delete public/ /
```

After it finishes, visit your CDN custom domain.

## Keep Vercel Too

You can keep both:

```text
Overseas: https://my-personal-blog-hexo.vercel.app
Mainland China: https://www.example.com
```

After the China domain is stable, update `hexo-blog/_config.yml`:

```yaml
url: https://www.example.com
```

Then redeploy.

## Alternative: Alibaba Cloud OSS + CDN

Alibaba Cloud OSS can also host static websites and bind custom CDN domains. Mainland China custom domains also require ICP filing. Tencent COS is used as the prepared workflow because it is simple for this static Hexo site and can be automated from GitHub Actions.
