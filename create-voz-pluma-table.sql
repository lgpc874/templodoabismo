-- Create Voz da Pluma manifestations table
CREATE TABLE IF NOT EXISTS voz_pluma_manifestations (
  id SERIAL PRIMARY KEY,
  manifestation_time TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  posted_date TEXT NOT NULL,
  posted_at TIMESTAMP DEFAULT NOW(),
  is_current BOOLEAN DEFAULT true
);

-- Insert some initial manifestations for testing
INSERT INTO voz_pluma_manifestations (manifestation_time, type, title, content, author, posted_date, is_current) VALUES
('07:00', 'dica', 'Despertar da Consciência', 'Ao amanhecer, quando as energias se renovam, permita que sua consciência desperte não apenas para o mundo físico, mas para as dimensões superiores de sua essência. O primeiro pensamento do dia molda toda a jornada.', 'Escriba do Templo', CURRENT_DATE::TEXT, true),
('09:00', 'verso', 'Verso da Manhã', 'Nas brumas matinais da existência,\nEu caminho entre mundos visíveis e ocultos,\nCarregando em mim a chama ancestral\nQue jamais se extingue.', 'Voz da Pluma', CURRENT_DATE::TEXT, true),
('11:00', 'reflexao', 'Reflexão do Meio-Dia', 'No auge do dia, quando o sol atinge seu zênite, reflita sobre o poder que reside em você. Cada decisão, cada pensamento, cada ação carrega o potencial de transformação. Use-o conscientemente.', 'Guardião da Sabedoria', CURRENT_DATE::TEXT, true);