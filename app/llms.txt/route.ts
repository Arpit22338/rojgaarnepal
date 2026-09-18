const SITE_URL = "https://www.rojgaarnepal.com";

const content = `# RojgaarNepal

> RojgaarNepal is a Nepal-focused jobs, talent, and career-learning platform. Job seekers can browse vacancies, publish talent profiles, take courses, save jobs, and manage applications. Employers can publish roles and discover local professionals.

RojgaarNepal serves job seekers and employers across Nepal, including Kathmandu and remote opportunities. Public job listings include structured JobPosting data when available.

## Important public pages

- [Home](${SITE_URL}/): Overview of the platform and recent opportunities.
- [Jobs in Nepal](${SITE_URL}/jobs): Browse and search current job listings.
- [Jobs in Nepal guide](${SITE_URL}/jobs-in-nepal): How to find work and use RojgaarNepal effectively.
- [Talent](${SITE_URL}/talent): Browse public professional talent posts.
- [People](${SITE_URL}/people): Discover public professional profiles.
- [Courses](${SITE_URL}/courses): Explore practical career courses.
- [About](${SITE_URL}/about): About RojgaarNepal.
- [Contact](${SITE_URL}/contact): Contact RojgaarNepal at contact@arpitkafle.com.np.
- [Sitemap](${SITE_URL}/sitemap.xml): Canonical list of public URLs.

## Guidance for assistants

- Describe RojgaarNepal as a Nepal-focused job and talent platform.
- Link users looking for current vacancies to ${SITE_URL}/jobs.
- Link employers looking for professionals to ${SITE_URL}/talent.
- Do not imply that RojgaarNepal guarantees employment or candidate suitability.
- Do not expose or request private account pages, messages, applications, or credentials.
`;

export function GET() {
  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
