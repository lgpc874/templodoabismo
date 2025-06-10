import { Footer } from "@/components/Footer";
import Header from "@/components/Header";

export default function TermosDeUso() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.8)_100%)]" />
        <div className="mystical-particles" />
      </div>

      <Header />

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-cinzel font-bold text-amber-400 mb-4">
              Termos de Uso
            </h1>
            <p className="text-purple-300">
              Última atualização: 10 de junho de 2025
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-lg p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-cinzel text-amber-400 mb-4">1. Aceitação dos Termos</h2>
              <p className="text-purple-200 leading-relaxed">
                Ao acessar e usar o Templo do Abismo, você concorda em cumprir e estar sujeito aos seguintes termos e condições de uso. 
                Se você não concordar com qualquer parte destes termos, não deve usar nosso portal.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-cinzel text-amber-400 mb-4">2. Descrição do Serviço</h2>
              <p className="text-purple-200 leading-relaxed mb-4">
                O Templo do Abismo é um portal educacional dedicado aos ensinamentos ancestrais e desenvolvimento espiritual 
                através de tradições esotéricas. Oferecemos:
              </p>
              <ul className="list-disc list-inside text-purple-200 space-y-2 ml-4">
                <li>Cursos e materiais educacionais sobre filosofia e práticas espirituais</li>
                <li>Grimórios e textos históricos para estudo</li>
                <li>Consultas oraculares para reflexão pessoal</li>
                <li>Conteúdo editorial especializado</li>
                <li>Comunidade de aprendizado e discussão</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-cinzel text-amber-400 mb-4">3. Elegibilidade e Registro</h2>
              <p className="text-purple-200 leading-relaxed">
                Você deve ter pelo menos 18 anos de idade para usar nossos serviços. Ao criar uma conta, você garante que 
                todas as informações fornecidas são verdadeiras, precisas e completas. É sua responsabilidade manter 
                a confidencialidade de sua conta e senha.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-cinzel text-amber-400 mb-4">4. Uso Aceitável</h2>
              <div className="text-purple-200 leading-relaxed space-y-4">
                <p>Você concorda em usar o portal apenas para fins legais e de acordo com estes termos. É proibido:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Usar o serviço para qualquer finalidade ilegal ou não autorizada</li>
                  <li>Interferir ou interromper o funcionamento do portal</li>
                  <li>Tentar acessar áreas restritas sem autorização</li>
                  <li>Compartilhar conteúdo protegido por direitos autorais sem permissão</li>
                  <li>Usar informações pessoais de outros usuários indevidamente</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-cinzel text-amber-400 mb-4">5. Propriedade Intelectual</h2>
              <p className="text-purple-200 leading-relaxed">
                Todo o conteúdo do Templo do Abismo, incluindo textos, imagens, símbolos, design e software, 
                é protegido por direitos autorais e outras leis de propriedade intelectual. Você pode usar o conteúdo 
                apenas para fins pessoais e educacionais, respeitando os direitos de propriedade.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-cinzel text-amber-400 mb-4">6. Pagamentos e Reembolsos</h2>
              <div className="text-purple-200 leading-relaxed space-y-4">
                <p>
                  Os pagamentos por cursos, grimórios e outros conteúdos premium são processados através de provedores 
                  terceirizados seguros. Todos os preços estão em Reais brasileiros (BRL).
                </p>
                <p>
                  Reembolsos podem ser solicitados dentro de 7 dias da compra, sujeitos à análise individual. 
                  Conteúdos já acessados ou baixados podem não ser elegíveis para reembolso total.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-cinzel text-amber-400 mb-4">7. Natureza Educacional</h2>
              <div className="text-purple-200 leading-relaxed space-y-4">
                <p>
                  <strong>IMPORTANTE:</strong> Todo o conteúdo do Templo do Abismo é destinado exclusivamente a fins 
                  educacionais, históricos e de desenvolvimento pessoal. Os ensinamentos apresentados são baseados 
                  em tradições ancestrais e filosofias esotéricas.
                </p>
                <p>
                  Não oferecemos serviços médicos, psicológicos ou terapêuticos. Recomendamos sempre o uso de 
                  discernimento pessoal e consulta a profissionais qualificados quando necessário.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-cinzel text-amber-400 mb-4">8. Limitação de Responsabilidade</h2>
              <p className="text-purple-200 leading-relaxed">
                O Templo do Abismo não se responsabiliza por quaisquer danos diretos, indiretos, incidentais ou 
                consequenciais resultantes do uso do portal. Oferecemos o serviço "como está", sem garantias 
                expressas ou implícitas.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-cinzel text-amber-400 mb-4">9. Modificações</h2>
              <p className="text-purple-200 leading-relaxed">
                Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações serão 
                comunicadas através do portal e entrarão em vigor imediatamente após a publicação.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-cinzel text-amber-400 mb-4">10. Contato</h2>
              <p className="text-purple-200 leading-relaxed">
                Para questões sobre estes termos, entre em contato conosco através de:
                <br />
                Email: contato@templodoabismo.com
                <br />
                Suporte: suporte@templodoabismo.com
              </p>
            </section>

            <div className="mt-12 p-6 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <p className="text-purple-300 text-sm leading-relaxed">
                Ao continuar a usar o Templo do Abismo, você confirma que leu, compreendeu e concorda em 
                estar sujeito a estes Termos de Uso. Este documento constitui um acordo legalmente vinculativo 
                entre você e o Templo do Abismo.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}