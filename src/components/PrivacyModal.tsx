import { useGame } from '../store/GameContext';
import { Modal } from './Modal';
import { Button3D } from './Button3D';

export function PrivacyModal() {
  const { setModal } = useGame();

  return (
    <Modal title="Gizlilik Politikası" onClose={() => setModal('pause')}>
      <div className="privacyText">
        <p>Söz Ustası kişisel veya hassas kullanıcı verisi toplamaz ve satmaz. Oyun ilerlemesi ve ayarlar yalnızca cihazda saklanır, cihaz dışına aktarılmaz.</p>
        <p>Ödüllü reklamlar için Google AdMob hizmeti kullanılır; Google, reklam kimliği ve cihaz bilgilerini kendi politikalarına göre işleyebilir. Reklam gizlilik tercihlerini Ayarlar &gt; Reklam Gizlilik Tercihleri bölümünden yönetebilirsin.</p>
        <p>Kamera, mikrofon, konum ve kişi listesi izinleri kullanılmaz. Destek ve gizlilik talepleri Play Store geliştirici iletişim kanalı üzerinden iletilebilir.</p>
      </div>
      <Button3D variant="gold" onClick={() => setModal('pause')}>Tamam</Button3D>
    </Modal>
  );
}
