import { useEffect, useState } from 'react';
import {
  isLeaderboardConfigured,
  isPlayGamesAvailable,
  loadLeagueStanding,
  PLAY_GAMES_LEADERBOARDS,
  showLeagueBoard,
  totalMasteryStars,
  type LeagueStanding,
} from '../services/playGames';
import type { LevelMastery } from '../types';

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
  const [weekly, setWeekly] = useState<LeagueStanding | null>(null);
  const [stars, setStars] = useState<LeagueStanding | null>(null);
  const localStars = totalMasteryStars(levelMastery);
  const boardsReady = isLeaderboardConfigured(PLAY_GAMES_LEADERBOARDS.weeklyScore)
    && isLeaderboardConfigured(PLAY_GAMES_LEADERBOARDS.regionStars);

  useEffect(() => {
    let alive = true;
    void (async () => {
      const ok = await isPlayGamesAvailable();
      if (!alive) return;
      setAvailable(ok);
      if (!ok || !leagueOptIn || calmMode) return;
      const [w, s] = await Promise.all([
        loadLeagueStanding('weeklyScore'),
        loadLeagueStanding('regionStars'),
      ]);
      if (!alive) return;
      setWeekly(w);
      setStars(s);
    })();
    return () => { alive = false; };
  }, [leagueOptIn, calmMode]);

  return (
    <section className="profileLeague" aria-label="Lig durumu">
      <div className="profileRecordsHeading">
        <h3>Lig</h3>
        <span>{leagueOptIn ? (calmMode ? 'Sakin Mod — gönderim kapalı' : 'Katılıyorsun') : 'Kapalı'}</span>
      </div>

      {!leagueOptIn ? (
        <p className="profileLeagueHint">
          İstersen Play Games ile haftalık puan ve bölge yıldızı sıralamasına katıl.
          {' '}
          <button type="button" className="profileLeagueLink" onClick={() => { playTap(); onOpenSettings(); }}>
            Ayarlardan aç
          </button>
        </p>
      ) : (
        <div className="profileLeagueGrid">
          <div>
            <strong>{weekly?.displayScore ?? '—'}</strong>
            <span>Haftalık puan</span>
            <small>Sıra: {weekly?.displayRank ?? '—'}</small>
          </div>
          <div>
            <strong>{stars?.displayScore ?? localStars}</strong>
            <span>Bölge yıldızı</span>
            <small>Sıra: {stars?.displayRank ?? '—'}</small>
          </div>
        </div>
      )}

      {leagueOptIn && available && boardsReady && (
        <div className="profileLeagueActions">
          <button
            type="button"
            className="profileLeagueBtn"
            onClick={() => { playTap(); void showLeagueBoard('weeklyScore'); }}
          >
            Haftalık lig
          </button>
          <button
            type="button"
            className="profileLeagueBtn"
            onClick={() => { playTap(); void showLeagueBoard('regionStars'); }}
          >
            Yıldız ligi
          </button>
        </div>
      )}

      {leagueOptIn && available && !boardsReady && (
        <p className="profileLeagueHint">Play Console’da lig kimlikleri tanımlandığında sıralama açılır.</p>
      )}

      {leagueOptIn && !available && (
        <p className="profileLeagueHint">Lig sıralaması Android + Play Games ile çalışır.</p>
      )}
    </section>
  );
}
