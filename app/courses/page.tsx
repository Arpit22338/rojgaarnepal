import { prisma } from "@/lib/prisma";
import CoursesList from "@/components/CoursesList";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const session = await getServerSession(authOptions);
  const courses = await prisma.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  let unlockedTitles: string[] = [];
  if (session?.user) {
    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: (session.user as any).id,
        status: "APPROVED"
      } as any,
      include: { course: true }
    });
    unlockedTitles = enrollments.map((e: any) => e.course.title);
  }

  const cvCourse = {
    id: "cv-building",
    title: "CV Building Masterclass",
    description: "Learn how to craft a professional CV that stands out. Includes certificate and templates.",
    price: 0,
    instructor: "RojgaarNepal Team",
    duration: "1 Hour",
    thumbnail: "/cv-course.jpg",
    isUnlocked: true // Free course
  };

  const pythonCourse = {
    id: "basic-python",
    title: "Basic Python Programming",
    description: "Master the fundamentals of Python programming. Includes certificate.",
    price: 299,
    instructor: "RojgaarNepal Team",
    duration: "2 Hours",
    thumbnail: "/python-course.jpg",
    isUnlocked: unlockedTitles.includes("Basic Python Programming")
  };

  const allCourses = [
    cvCourse, 
    pythonCourse, 
    ...courses.map(c => ({
      ...c,
      instructor: c.instructor || "Unknown",
      duration: c.duration || "Self-paced",
      isUnlocked: unlockedTitles.includes(c.title)
    }))
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Skill Courses</h1>
      </div>

      <CoursesList courses={allCourses} />
    </div>
  );
}
