import { useGame } from '../store/GameContext';
import { Modal } from './Modal';
import { PremiumPrimaryButton } from './PremiumPrimaryButton';

export function PrivacyModal() {
  const { setModal, screen } = useGame();
  const close = () => setModal(screen === 'game' ? 'pause' : null);

  return (
    <Modal title="Gizlilik Politikası" onClose={close}>
      <div className="privacyText">
        <p>Oyun ilerlemen ve ayarların cihazında saklanır. İlk açılışta Play Games skor paylaşımını sana sorarız. Katılırsan, Google Play Games oturumun açıkken seviye tamamladığında o seviyenin puanı ve toplam yıldız puanın Google Play Games'e gönderilir. Giriş yapmadıysan ana ekrandaki Play Games sıralamaları düğmesinden giriş yapabilirsin. Skorlar herkese açık sıralamalarda görünür; oyuncu adın ve profil bilgilerinin görünürlüğü Google Play Games profil ayarlarına bağlıdır. Seçimini Ayarlar'dan değiştirebilirsin. Katılımı kapatınca yeni skor gönderilmez; daha önce gönderilen skorlar silinmez.</p>
        <p>Ödüllü reklamlar için Google AdMob hizmeti kullanılır; Google, reklam kimliği ve cihaz bilgilerini kendi politikalarına göre işleyebilir. Reklam gizlilik tercihlerini Ayarlar &gt; Reklam Gizlilik Tercihleri bölümünden yönetebilirsin.</p>
        <p>Kamera, mikrofon, konum ve kişi listesi izinleri kullanılmaz. Destek ve gizlilik talepleri Play Store geliştirici iletişim kanalı üzerinden iletilebilir.</p>
      </div>
      <PremiumPrimaryButton size="compact" onClick={close}>Tamam</PremiumPrimaryButton>
    </Modal>
  );
}
