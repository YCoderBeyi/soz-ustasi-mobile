import { useGame } from '../store/GameContext';
import { Modal } from './Modal';
import { Button3D } from './Button3D';

export function PrivacyModal() {
  const { setModal } = useGame();

  return (
    <Modal title="Gizlilik Politikası" onClose={() => setModal('pause')}>
      <div className="privacyText">
        <p>Söz Ustası bu sürümde kişisel veri toplamaz, paylaşmaz ve reklam kimliği kullanmaz.</p>
        <p>Oyun ilerlemesi ve ayarlar yalnızca cihazda saklanır, cihaz dışına aktarılmaz. Kamera, mikrofon, konum ve kişi listesi izinleri kullanılmaz.</p>
        <p>Destek ve gizlilik talepleri Play Store geliştirici iletişim kanalı üzerinden iletilebilir.</p>
      </div>
      <Button3D variant="gold" onClick={() => setModal('pause')}>Tamam</Button3D>
    </Modal>
  );
}
