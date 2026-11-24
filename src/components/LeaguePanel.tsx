import { useEffect, useState } from 'react';
import type { LeaderboardScore, PlayerInfo } from '@modbender/capacitor-play-games';
import {
  isLeaderboardConfigured,
  isPlayGamesAvailable,
  loadLeaguePreview,
  loadLeagueStanding,
  PLAY_GAMES_LEADERBOARDS,
  showLeagueBoard,
  totalMasteryStars,
} from '../services/playGames';
import type { LevelMastery } from '../types';

type BoardKey = keyof typeof PLAY_GAMES_LEADERBOARDS;
type Preview = Awaited<ReturnType<typeof loadLeaguePreview>>;
type Standing = Awaited<ReturnType<typeof loadLeagueStanding>>;

const boardCopy: Record<BoardKey, { label: string; title: string; scope: string; empty: string }> = {
  weeklyScore: { label: 'Haftalık puan', title: 'Haftanın ustaları', scope: 'Bu hafta', empty: 'Bu haftanın ilk skorunu sen gönder.' },
  regionStars: { label: 'Ustalık yıldızları', title: 'Ustalık sıralaması', scope: 'Tüm zamanlar', empty: 'İlk yıldızların burada görünecek.' },
};

function initials(name?: string) {
  const words = name?.trim().split(/\s+/).filter(Boolean) ?? [];
  return words.slice(0, 2).map((word) => Array.from(word)[0]?.toLocaleUpperCase('tr-TR')).join('') || '•';
}

function Avatar({ name, src, own = false }: { name?: string; src?: string; own?: boolean }) {
  return (
    <span className={`leagueAvatar${own ? ' leagueAvatar--own' : ''}`} aria-hidden="true">
      {src ? <img src={src} alt="" loading="lazy" referrerPolicy="no-referrer" onError={(event) => { event.currentTarget.remove(); }} /> : initials(name)}
    </span>
  );
}

function statusText(standing: Standing | null, loading: boolean) {
  if (loading) return 'Sıralama yükleniyor…';
  if (standing?.status === 'signed-out') return 'Sıralamayı görmek için Play Games’e giriş yap.';
  if (standing?.status === 'error') return 'Sıralama alınamadı. Bağlantını kontrol edip yeniden dene.';
  if (standing?.status === 'unavailable') return 'Play Games sıralaması şu an kullanılamıyor.';
  return '';
}

export function LeaguePanel({
  leagueOptIn,
  calmMode,
  levelMastery,
  onOpenSettings,
  playTap,
}: {
  leagueOptIn: boolean;
  calmMode: boolean;
  levelMastery: Record<number, LevelMastery>;
  onOpenSettings: () => void;
  playTap: () => void;
}) {
  const [available, setAvailable] = useState(false);
  const [activeBoard, setActiveBoard] = useState<BoardKey>('weeklyScore');
  const [preview, setPreview] = useState<Preview>(null);
  const [standing, setStanding] = useState<Standing | null>(null);
  const [loading, setLoading] = useState(false);
  const [opening, setOpening] = useState(false);
  const [message, setMessage] = useState('');
  const localStars = totalMasteryStars(levelMastery);
  const boardsReady = isLeaderboardConfigured(PLAY_GAMES_LEADERBOARDS.weeklyScore)
    && isLeaderboardConfigured(PLAY_GAMES_LEADERBOARDS.regionStars);

  useEffect(() => {
    let alive = true;
    void isPlayGamesAvailable().then((isAvailable) => {
      if (alive) setAvailable(isAvailable);
    });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!available || !boardsReady) return;
    let alive = true;
    setLoading(true);
    setMessage('');
    void Promise.all([loadLeaguePreview(activeBoard), loadLeagueStanding(activeBoard)])
      .then(([rows, ownStanding]) => {
        if (!alive) return;
        setPreview(rows);
        setStanding(ownStanding);
      })
      .catch(() => {
        if (!alive) return;
        setPreview(null);
        setStanding({ status: 'error', detail: 'load-failed' });
      })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [activeBoard, available, boardsReady]);

  const openBoard = async () => {
    if (opening) return;
    playTap();
    setOpening(true);
    setMessage('');
    try {
      if (!await showLeagueBoard(activeBoard)) setMessage('Play Games’e giriş tamamlanmadı. İstersen yeniden dene.');
    } catch {
      setMessage('Sıralama açılamadı. Play Games bağlantını kontrol edip tekrar dene.');
    } finally {
      setOpening(false);
    }
  };

  const players = preview?.scores ?? [];
  const player = preview?.player;
  const ownScore = preview?.ownScore;
  const ownAlreadyListed = Boolean(ownScore && players.some((score) =>
    (player?.playerId && score.scoreHolder?.playerId === player.playerId)
    || (typeof ownScore.rank === 'number' && score.rank === ownScore.rank),
  ));
  const status = statusText(standing, loading);
  const personalScore = activeBoard === 'regionStars' && standing?.status === 'no-score'
    ? String(localStars)
    : standing?.status === 'ok' ? standing.standing.displayScore : '';
  const showPinnedSelf = Boolean(player && ownScore && !ownAlreadyListed);

  return (
    <section className="profileLeague" aria-label="Play Games sıralaması">
      <div className="profileLeagueTopline">
        <div>
          <p className="profileLeagueEyebrow">SÖZ USTASI LİGİ</p>
          <h3>{boardCopy[activeBoard].title}</h3>
        </div>
        {player && <div className="profileLeagueIdentity"><Avatar name={player.displayName} src={player.avatarUrl || player.hiResImageUrl} own /><span>{player.displayName || 'Oyuncu'}</span></div>}
      </div>

      <div className="profileLeagueTabs" role="tablist" aria-label="Sıralama türü">
        {(Object.keys(boardCopy) as BoardKey[]).map((key) => (
          <button key={key} type="button" role="tab" aria-selected={activeBoard === key} className={activeBoard === key ? 'is-active' : ''}
            onClick={() => { if (activeBoard !== key) { playTap(); setActiveBoard(key); } }}>
            {boardCopy[key].label}
          </button>
        ))}
      </div>

      <div className="profileLeagueMeta"><span>{boardCopy[activeBoard].scope}</span><span>İlk 10 · puan</span></div>

      {available && boardsReady && players.length > 0 && (
        <>
        <div className="profileLeagueColumnLabels" aria-hidden="true"><span>SIRA</span><span /><span>OYUNCU</span><span>PUAN</span></div>
        <ol className="profileLeagueRows" aria-live="polite" aria-busy={loading}>
          {players.map((score, index) => {
            const isOwn = Boolean((player?.playerId && score.scoreHolder?.playerId === player.playerId)
              || (typeof ownScore?.rank === 'number' && score.rank === ownScore.rank));
            return <LeagueRow key={`${score.rank ?? index}-${score.scoreHolder?.playerId ?? score.scoreHolderDisplayName}`} score={score} index={index} own={isOwn} />;
          })}
          {showPinnedSelf && ownScore && <LeagueRow score={ownScore} index={players.length} own player={player ?? undefined} />}
        </ol>
        </>
      )}

      {available && boardsReady && players.length === 0 && !loading && standing?.status === 'no-score' && (
        <div className="profileLeagueEmpty"><span aria-hidden="true">✦</span><p>{boardCopy[activeBoard].empty}</p>{personalScore && <small>Yerel yıldız sayın: {personalScore}</small>}</div>
      )}
      {(!available || !boardsReady || status) && <p className="profileLeagueMessage" role="status">
        {!available ? 'Canlı sıralama Android’de Play Games ile görüntülenir.' : !boardsReady ? 'Sıralama henüz yapılandırılmadı.' : status}
      </p>}

      {!calmMode && <p className="profileLeagueCalm">{leagueOptIn ? 'Skor gönderimi açık' : 'Skor gönderimi kapalı · sıralama herkese açık'}</p>}
      {calmMode && <p className="profileLeagueCalm">Sakin Mod’da yeni skor gönderilmez.</p>}
      <div className="profileLeagueFooter">
        <button type="button" className="profileLeagueLink" onClick={() => { playTap(); onOpenSettings(); }}>Paylaşım tercihi</button>
        <button type="button" className="profileLeagueBtn" onClick={() => void openBoard()} disabled={!available || !boardsReady || opening}>
          {opening ? 'Açılıyor…' : 'Tam sıralamayı aç'}
        </button>
      </div>
      {message && <p className="profileLeagueMessage" role="status">{message}</p>}
    </section>
  );
}

function LeagueRow({ score, index, own, player }: { score: LeaderboardScore; index: number; own: boolean; player?: PlayerInfo }) {
  const holder = score.scoreHolder;
  const name = own ? player?.displayName || holder?.displayName || score.scoreHolderDisplayName : holder?.displayName || score.scoreHolderDisplayName;
  const avatar = own ? player?.avatarUrl || player?.hiResImageUrl || score.scoreHolderIconImageUrl : score.scoreHolderIconImageUrl || holder?.avatarUrl;
  const rank = score.displayRank || (typeof score.rank === 'number' ? `#${score.rank}` : `#${index + 1}`);
  return (
    <li className={`profileLeagueRow${own ? ' is-own' : ''}`} aria-current={own ? 'true' : undefined}>
      <span className={`profileLeagueRank${index < 3 ? ` is-top-${index + 1}` : ''}`}>{rank}</span>
      <Avatar name={name} src={avatar} own={own} />
      <span className="profileLeaguePlayer">{name || 'Oyuncu'}{own && <small>Sen</small>}</span>
      <strong>{score.displayScore || String(score.rawScore)}</strong>
    </li>
  );
}
