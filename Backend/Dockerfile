FROM php:8.2-fpm-alpine AS base

# Dépendances système
RUN apk update && apk add --no-cache \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libzip-dev \
    oniguruma-dev \
    zip \
    unzip \
    git

# Extensions PHP + nettoyage des outils de build
RUN apk add --no-cache --virtual .build-deps \
    $PHPIZE_DEPS \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql mbstring zip exif pcntl bcmath gd \
    && apk del .build-deps

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# ── Stage développement ──────────────────────────────
FROM base AS development

COPY . .
RUN composer install --no-interaction --prefer-dist --no-scripts
RUN chown -R www-data:www-data storage bootstrap/cache

EXPOSE 8001
CMD php artisan serve --host=0.0.0.0 --port=${PORT:-8001}

# ── Stage production ─────────────────────────────────
FROM base AS production

COPY . .

# Install sans dépendances de dev, avec optimisations
RUN composer install \
    --no-interaction \
    --no-dev \
    --optimize-autoloader \
    --no-scripts \
    --prefer-dist || \
    (sleep 5 && composer install \
    --no-interaction \
    --no-dev \
    --optimize-autoloader \
    --no-scripts \
    --prefer-dist)

RUN chown -R www-data:www-data storage bootstrap/cache

EXPOSE 8001
CMD php artisan serve --host=0.0.0.0 --port=${PORT:-8001}