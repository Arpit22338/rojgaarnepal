import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";

async function updateReportStatus(formData: FormData) {
  "use server";
  const reportId = formData.get("reportId") as string;
  const status = formData.get("status") as string;
  
  if (!reportId || !status) return;

  await prisma.report.update({
    where: { id: reportId },
    data: { status },
  });
  
  revalidatePath("/admin/reports");
}

export default async function AdminReportsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const reports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      reporter: {
        select: { name: true, email: true },
      },
      targetJob: {
        select: { id: true, title: true },
      },
      targetUser: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reports</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporter</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No reports found.
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>{report.reporter.name}</div>
                    <div className="text-xs text-gray-500">{report.reporter.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {report.targetJob ? (
                      <Link href={`/jobs/${report.targetJob.id}`} className="text-blue-600 hover:underline">
                        Job: {report.targetJob.title}
                      </Link>
                    ) : report.targetUser ? (
                      <Link href={`/profile/${report.targetUser.id}`} className="text-blue-600 hover:underline">
                        User: {report.targetUser.name}
                      </Link>
                    ) : (
                      <span className="text-gray-400">Unknown Target</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {report.reason}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      report.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      report.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {report.status === 'PENDING' && (
                      <>
                        <form action={updateReportStatus} className="inline">
                          <input type="hidden" name="reportId" value={report.id} />
                          <input type="hidden" name="status" value="RESOLVED" />
                          <button type="submit" className="text-green-600 hover:text-green-900">Resolve</button>
                        </form>
                        <form action={updateReportStatus} className="inline">
                          <input type="hidden" name="reportId" value={report.id} />
                          <input type="hidden" name="status" value="DISMISSED" />
                          <button type="submit" className="text-gray-600 hover:text-gray-900">Dismiss</button>
                        </form>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
