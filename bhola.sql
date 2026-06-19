CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  chat_id BIGINT UNIQUE,
  username TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  chat_id BIGINT,
  message TEXT,
  reply TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);