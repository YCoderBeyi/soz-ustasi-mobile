import { useGame } from '../store/GameContext';
import { Modal } from './Modal';
import { PremiumPrimaryButton } from './PremiumPrimaryButton';

export function PrivacyModal() {
  const { setModal, screen } = useGame();
  const close = () => setModal(screen === 'game' ? 'pause' : null);

  return (
    <Modal title="Gizlilik Politikası" onClose={close}>
      <div className="privacyText">
        <p>Söz Ustası kişisel veya hassas kullanıcı verisi toplamaz ve satmaz. Oyun ilerlemesi ve ayarlar yalnızca cihazda saklanır, cihaz dışına aktarılmaz.</p>
        <p>Ödüllü reklamlar için Google AdMob hizmeti kullanılır; Google, reklam kimliği ve cihaz bilgilerini kendi politikalarına göre işleyebilir. Reklam gizlilik tercihlerini Ayarlar &gt; Reklam Gizlilik Tercihleri bölümünden yönetebilirsin.</p>
        <p>Kamera, mikrofon, konum ve kişi listesi izinleri kullanılmaz. Destek ve gizlilik talepleri Play Store geliştirici iletişim kanalı üzerinden iletilebilir.</p>
      </div>
      <PremiumPrimaryButton size="compact" onClick={close}>Tamam</PremiumPrimaryButton>
    </Modal>
  );
}
