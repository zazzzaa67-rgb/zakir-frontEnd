import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createTeam,
  getInvitations,
  getLeaderboard,
  getTeam,
  inviteStudent,
  respondToInvitation,
  searchStudents,
} from '../lib/api';

export default function TeamScreen() {
  const navigate = useNavigate();

  const [team, setTeam] = useState<any>(null);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [students, setStudents] = useState<any[]>([]);

  async function refresh() {
    try {
      setError('');
      const [current, incoming, ranking] = await Promise.all([
        getTeam(),
        getInvitations(),
        getLeaderboard(),
      ]);
      setTeam(current.team);
      setInvitations(incoming.invitations);
      setLeaderboard(ranking.teams);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر تحميل الفرق');
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function makeTeam() {
    if (!name.trim()) return;
    try {
      await createTeam(name);
      setName('');
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر إنشاء الفريق');
    }
  }

  async function respond(id: string, action: 'accepted' | 'declined') {
    try {
      await respondToInvitation(id, action);
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر تنفيذ الدعوة');
    }
  }

  async function findStudents() {
    if (!query.trim()) return;
    try {
      const res = await searchStudents(query);
      setStudents(res.students);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر البحث');
    }
  }

  async function invite(id: string) {
    if (!team) return;
    try {
      await inviteStudent(team.id, id);
      setStudents((current) => current.filter((student) => student.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر إرسال الدعوة');
    }
  }

  return (
    <div className="flex h-full flex-col bg-[#f4f7fb] text-right">
      {/* Header */}
      <header className="bg-[#0b1a34] px-5 pb-7 pt-12 text-white">
        <button
          onClick={() => navigate('/home')}
          className="mb-6 text-white/60 hover:text-white transition-colors cursor-pointer"
        >
          ← الرئيسية
        </button>
        <p className="text-sm font-bold text-cyan-300">مساحة المذاكرة الجماعية</p>
        <h1 className="mt-1 text-3xl font-black">فرقك الدراسية</h1>
        <p className="mt-2 text-sm text-white/60">تحدي، تعاون، ونافسوا بذكاء</p>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-8 pt-5">
        {error && (
          <p className="mb-4 rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-600">
            {error}
          </p>
        )}

        {/* Create Team Section */}
        {!team && (
          <section className="mb-5 rounded-3xl bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">اعمل فرقتك</h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  محتاج 300 Points و20 Coins، والفرقة لحد 6 طلاب من نفس النوع.
                </p>
              </div>
              <span className="text-3xl">🚀</span>
            </div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="اسم الفرقة"
              className="mb-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-400"
            />
            <button
              disabled={!name.trim()}
              onClick={makeTeam}
              className="w-full rounded-2xl bg-[#0b1a34] py-3 font-black text-white disabled:opacity-40 cursor-pointer active:scale-98 transition-all"
            >
              إنشاء الفرقة
            </button>
          </section>
        )}

        {/* Invitations Section */}
        {invitations.length > 0 && (
          <section className="mb-5">
            <h2 className="mb-3 text-lg font-black text-slate-900">دعوات وصلت لك</h2>
            {invitations.map((item) => (
              <div key={item.id} className="mb-2 rounded-2xl bg-white p-4 shadow-sm">
                <p className="font-black text-slate-900">
                  دعوة للانضمام إلى {item.study_teams?.name}
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => respond(item.id, 'accepted')}
                    className="flex-1 rounded-xl bg-emerald-500 py-2 text-sm font-black text-white cursor-pointer active:scale-95 transition-transform"
                  >
                    قبول
                  </button>
                  <button
                    onClick={() => respond(item.id, 'declined')}
                    className="flex-1 rounded-xl bg-slate-100 py-2 text-sm font-black text-slate-600 cursor-pointer active:scale-95 transition-transform"
                  >
                    رفض
                  </button>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Current Team & Invite Section */}
        {team && (
          <>
            <section className="mb-5 rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-600 p-5 text-white shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-white/70">فرقتك الحالية</p>
                  <h2 className="mt-1 text-2xl font-black">{team.name}</h2>
                </div>
                <span className="rounded-xl bg-white/20 px-3 py-2 text-sm font-black">
                  {team.study_team_members?.length ?? 0}/6
                </span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2">
                {(team.study_team_members ?? []).map((member: any) => (
                  <div key={member.student_id} className="rounded-xl bg-white/15 p-3">
                    <p className="text-sm font-black">{member.student_profiles?.display_name}</p>
                    <p className="text-xs text-white/70">
                      {member.student_profiles?.points ?? 0} نقطة
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-5 rounded-3xl bg-white p-5 shadow-sm">
              <h2 className="mb-1 text-lg font-black text-slate-900">ادعُ طالبًا</h2>
              <p className="mb-3 text-xs text-slate-500">
                ابحث بالاسم، والدعوة لا تُقبل إلا من الطالب نفسه.
              </p>
              <div className="flex gap-2">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && findStudents()}
                  placeholder="اسم الطالب"
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-cyan-400"
                />
                <button
                  onClick={findStudents}
                  className="rounded-xl bg-[#0b1a34] px-4 text-sm font-black text-white cursor-pointer active:scale-95 transition-transform"
                >
                  بحث
                </button>
              </div>
              {students.map((student) => (
                <div
                  key={student.id}
                  className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 p-3"
                >
                  <div>
                    <p className="font-black text-slate-800">{student.display_name}</p>
                    <p className="text-xs text-slate-400">الصف {student.grade_level}</p>
                  </div>
                  <button
                    onClick={() => invite(student.id)}
                    className="rounded-lg bg-cyan-500 px-3 py-2 text-xs font-black text-white cursor-pointer active:scale-95 transition-transform"
                  >
                    دعوة
                  </button>
                </div>
              ))}
            </section>
          </>
        )}

        {/* Leaderboard Section */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900">ترتيب الفرق</h2>
            <span className="text-xs font-bold text-slate-400">حسب مجموع النقاط</span>
          </div>
          {leaderboard.map((item, index) => (
            <div
              key={item.id}
              className="mb-2 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm"
            >
              <span className="w-7 text-center text-lg font-black text-slate-400">
                {index + 1}
              </span>
              <div className="flex-1">
                <p className="font-black text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-400">{item.memberCount}/6 طلاب</p>
              </div>
              <strong className="text-cyan-600">
                {item.totalPoints?.toLocaleString() ?? 0} <small>نقطة</small>
              </strong>
            </div>
          ))}
        </section>

        <p className="mt-5 text-center text-xs leading-5 text-slate-400">
          الانضمام لا يتم إلا بعد قبول الدعوة. لا يمكن إنشاء فريق ثانٍ قبل مغادرة الفريق الحالي.
        </p>
      </div>
    </div>
  );
}