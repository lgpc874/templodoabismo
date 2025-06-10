import Footer from "@/components/footer";
import Header from "@/components/Header";

export default function PoliticaDePrivacidade() {
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
              Política de Privacidade
            </h1>
            <p className="text-purple-300">
              Última atualização: 10 de junho de 2025
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-lg p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-cinzel text-amber-400 mb-4">1. Introdução</h2>
              <p className="text-purple-200 leading-relaxed">
                O Templo do Abismo está comprometido em proteger sua privacidade e dados pessoais. Esta política 
                descreve como coletamos, usamos, armazenamos e protegemos suas informações quando você utiliza 
                nosso portal educacional.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-cinzel text-amber-400 mb-4">2. Informações que Coletamos</h2>
              <div className="text-purple-200 leading-relaxed space-y-4">
                <h3 className="text-lg font-medium text-amber-300">2.1 Informações Fornecidas Diretamente</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Nome completo e nome de usuário</li>
                  <li>Endereço de email</li>
                  <li>Informações de perfil (nome mágico, nível de iniciação)</li>
                  <li>Informações de pagamento (processadas por terceiros seguros)</li>
                  <li>Conteúdo de comunicações conosco</li>
                </ul>

                <h3 className="text-lg font-medium text-amber-300">2.2 Informações Coletadas Automaticamente</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Endereço IP e localização geográfica aproximada</li>
                  <li>Tipo de dispositivo e navegador</li>
                  <li>Páginas visitadas e tempo de navegação</li>
                  <li>Consultas ao oráculo e histórico de uso</li>
                  <li>Cookies e tecnologias similares</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-cinzel text-amber-400 mb-4">3. Como Usamos suas Informações</h2>
              <div className="text-purple-200 leading-relaxed">
                <p className="mb-4">Utilizamos suas informações para:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Fornecer e melhorar nossos serviços educacionais</li>
                  <li>Processar pagamentos e gerenciar assinaturas</li>
                  <li>Personalizar sua experiência de aprendizado</li>
                  <li>Enviar atualizações sobre cursos e conteúdos</li>
                  <li>Responder a suas perguntas e fornecer suporte</li>
                  <li>Manter a segurança e integridade do portal</li>
                  <li>Cumprir obrigações legais e regulamentares</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-cinzel text-amber-400 mb-4">4. Base Legal para Processamento</h2>
              <div className="text-purple-200 leading-relaxed space-y-4">
                <p>Processamos seus dados pessoais com base em:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Consentimento:</strong> Quando você nos fornece permissão explícita</li>
                  <li><strong>Execução contratual:</strong> Para fornecer os serviços solicitados</li>
                  <li><strong>Interesse legítimo:</strong> Para melhorar nossos serviços e segurança</li>
                  <li><strong>Obrigação legal:</strong> Para cumprir requisitos legais aplicáveis</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-cinzel text-amber-400 mb-4">5. Compartilhamento de Informações</h2>
              <div className="text-purple-200 leading-relaxed space-y-4">
                <p>Não vendemos ou alugamos suas informações pessoais. Podemos compartilhar dados apenas com:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Prestadores de serviços:</strong> Processamento de pagamentos, hospedagem, analytics</li>
                  <li><strong>Autoridades legais:</strong> Quando exigido por lei ou para proteger direitos</li>
                  <li><strong>Parceiros educacionais:</strong> Com seu consentimento explícito</li>
                  <li><strong>Sucessores empresariais:</strong> Em caso de fusão ou aquisição</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-cinzel text-amber-400 mb-4">6. Segurança de Dados</h2>
              <div className="text-purple-200 leading-relaxed space-y-4">
                <p>Implementamos medidas técnicas e organizacionais para proteger seus dados:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Criptografia de dados em trânsito e em repouso</li>
                  <li>Controle de acesso restrito a informações pessoais</li>
                  <li>Monitoramento contínuo de segurança</li>
                  <li>Backups regulares e planos de recuperação</li>
                  <li>Auditorias de segurança periódicas</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-cinzel text-amber-400 mb-4">7. Seus Direitos</h2>
              <div className="text-purple-200 leading-relaxed space-y-4">
                <p>Você tem os seguintes direitos sobre seus dados pessoais:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Acesso:</strong> Solicitar cópia dos dados que mantemos sobre você</li>
                  <li><strong>Retificação:</strong> Corrigir informações inexatas ou incompletas</li>
                  <li><strong>Exclusão:</strong> Solicitar a remoção de seus dados pessoais</li>
                  <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
                  <li><strong>Limitação:</strong> Restringir o processamento de seus dados</li>
                  <li><strong>Oposição:</strong> Opor-se ao processamento para fins específicos</li>
                  <li><strong>Revogação:</strong> Retirar consentimento a qualquer momento</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-cinzel text-amber-400 mb-4">8. Cookies e Tecnologias Similares</h2>
              <div className="text-purple-200 leading-relaxed space-y-4">
                <p>Utilizamos cookies para:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Manter você logado durante a sessão</li>
                  <li>Lembrar suas preferências de configuração</li>
                  <li>Analisar o uso do portal para melhorias</li>
                  <li>Personalizar conteúdo e experiência</li>
                </ul>
                <p>Você pode gerenciar cookies através das configurações do seu navegador.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-cinzel text-amber-400 mb-4">9. Retenção de Dados</h2>
              <p className="text-purple-200 leading-relaxed">
                Mantemos seus dados pessoais apenas pelo tempo necessário para cumprir as finalidades 
                descritas nesta política, atender requisitos legais ou resolver disputas. Dados de 
                conta são mantidos enquanto sua conta estiver ativa, e histórico educacional pode 
                ser preservado para fins de certificação.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-cinzel text-amber-400 mb-4">10. Transferências Internacionais</h2>
              <p className="text-purple-200 leading-relaxed">
                Alguns de nossos prestadores de serviços podem estar localizados fora do Brasil. 
                Garantimos que todas as transferências internacionais de dados pessoais sejam 
                realizadas com salvaguardas adequadas e em conformidade com a LGPD.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-cinzel text-amber-400 mb-4">11. Menores de Idade</h2>
              <p className="text-purple-200 leading-relaxed">
                Nossos serviços são destinados a pessoas com 18 anos ou mais. Não coletamos 
                intencionalmente informações pessoais de menores de idade. Se tomarmos conhecimento 
                de que coletamos dados de menores, removeremos essas informações imediatamente.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-cinzel text-amber-400 mb-4">12. Alterações nesta Política</h2>
              <p className="text-purple-200 leading-relaxed">
                Podemos atualizar esta política periodicamente para refletir mudanças em nossas 
                práticas ou requisitos legais. Notificaremos sobre alterações significativas 
                através do portal ou por email, conforme apropriado.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-cinzel text-amber-400 mb-4">13. Contato e Encarregado de Dados</h2>
              <div className="text-purple-200 leading-relaxed space-y-4">
                <p>Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato:</p>
                <div className="bg-purple-500/10 p-4 rounded-lg">
                  <p><strong>Email:</strong> privacidade@templodoabismo.com</p>
                  <p><strong>Contato Geral:</strong> contato@templodoabismo.com</p>
                  <p><strong>Suporte:</strong> suporte@templodoabismo.com</p>
                </div>
                <p>
                  Nosso Encarregado de Proteção de Dados está disponível para atender suas solicitações 
                  e esclarecer questões relacionadas ao tratamento de dados pessoais.
                </p>
              </div>
            </section>

            <div className="mt-12 p-6 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <p className="text-purple-300 text-sm leading-relaxed">
                <strong>Compromisso com a LGPD:</strong> Esta política está em conformidade com a Lei Geral 
                de Proteção de Dados (LGPD - Lei 13.709/2018) e outras regulamentações aplicáveis de 
                proteção de dados. Estamos comprometidos em tratar seus dados pessoais com transparência, 
                segurança e respeito aos seus direitos fundamentais.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}