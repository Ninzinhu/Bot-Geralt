const { PermissionFlagsBits } = require('discord.js');

/**
 * Verifica se o usuário tem permissão de administrador
 * @param {import('discord.js').GuildMember} member - Membro do servidor
 * @returns {boolean} - True se tem permissão, false caso contrário
 */
function hasAdminPermission(member) {
    return member.permissions.has(PermissionFlagsBits.Administrator);
}

/**
 * Verifica se o usuário tem permissão de moderador (Administrador ou Moderador)
 * @param {import('discord.js').GuildMember} member - Membro do servidor
 * @returns {boolean} - True se tem permissão, false caso contrário
 */
function hasModeratorPermission(member) {
    return member.permissions.has(PermissionFlagsBits.Administrator) || 
           member.permissions.has(PermissionFlagsBits.ModerateMembers);
}

/**
 * Verifica se o usuário tem permissão específica
 * @param {import('discord.js').GuildMember} member - Membro do servidor
 * @param {bigint} permission - Permissão específica
 * @returns {boolean} - True se tem permissão, false caso contrário
 */
function hasSpecificPermission(member, permission) {
    return member.permissions.has(permission);
}

/**
 * Verifica se o usuário tem cargo específico
 * @param {import('discord.js').GuildMember} member - Membro do servidor
 * @param {string} roleId - ID do cargo
 * @returns {boolean} - True se tem o cargo, false caso contrário
 */
function hasRole(member, roleId) {
    return member.roles.cache.has(roleId);
}

/**
 * Verifica se o usuário tem cargo de moderador configurado
 * @param {import('discord.js').GuildMember} member - Membro do servidor
 * @returns {boolean} - True se tem cargo de moderador, false caso contrário
 */
function hasModeratorRole(member) {
    const moderatorRoleId = process.env.MODERATOR_ROLE_ID;
    if (!moderatorRoleId) {
        // Se não estiver configurado, usar permissão de administrador
        return hasAdminPermission(member);
    }
    return hasRole(member, moderatorRoleId);
}

/**
 * Verifica se o usuário tem cargo de staff configurado
 * @param {import('discord.js').GuildMember} member - Membro do servidor
 * @returns {boolean} - True se tem cargo de staff, false caso contrário
 */
function hasStaffRole(member) {
    const staffRoleId = process.env.STAFF_ROLE_ID;
    if (!staffRoleId) {
        // Se não estiver configurado, usar permissão de administrador
        return hasAdminPermission(member);
    }
    return hasRole(member, staffRoleId);
}

/**
 * Verifica se o usuário pode executar comandos de moderação
 * @param {import('discord.js').GuildMember} member - Membro do servidor
 * @returns {boolean} - True se pode executar, false caso contrário
 */
function canExecuteModeration(member) {
    return hasAdminPermission(member) || hasModeratorRole(member);
}

/**
 * Verifica se o usuário pode executar comandos de automod
 * @param {import('discord.js').GuildMember} member - Membro do servidor
 * @returns {boolean} - True se pode executar, false caso contrário
 */
function canExecuteAutomod(member) {
    return hasAdminPermission(member);
}

/**
 * Verifica se o usuário pode executar comandos de música
 * @param {import('discord.js').GuildMember} member - Membro do servidor
 * @returns {boolean} - True se pode executar, false caso contrário
 */
function canExecuteMusic(member) {
    // Música pode ser usada por qualquer pessoa em canal de voz
    return true;
}

/**
 * Retorna mensagem de erro de permissão
 * @param {string} commandName - Nome do comando
 * @param {string} requiredPermission - Permissão necessária
 * @returns {string} - Mensagem de erro formatada
 */
function getPermissionError(commandName, requiredPermission) {
    return `❌ **Permissão Negada!**\n\n` +
           `Você precisa ter a permissão **${requiredPermission}** para usar o comando \`/${commandName}\`.\n\n` +
           `**Permissões necessárias:**\n` +
           `• ${requiredPermission}\n\n` +
           `**Como obter:**\n` +
           `• Peça a um administrador para dar a permissão\n` +
           `• Ou use \`/permissions verificar\` para diagnosticar`;
}

/**
 * Retorna mensagem de erro de cargo
 * @param {string} commandName - Nome do comando
 * @param {string} requiredRole - Cargo necessário
 * @returns {string} - Mensagem de erro formatada
 */
function getRoleError(commandName, requiredRole) {
    return `❌ **Cargo Necessário!**\n\n` +
           `Você precisa ter o cargo **${requiredRole}** para usar o comando \`/${commandName}\`.\n\n` +
           `**Cargo necessário:**\n` +
           `• ${requiredRole}\n\n` +
           `**Como obter:**\n` +
           `• Peça a um administrador para dar o cargo\n` +
           `• Ou use \`/permissions verificar\` para diagnosticar`;
}

module.exports = {
    hasAdminPermission,
    hasModeratorPermission,
    hasSpecificPermission,
    hasRole,
    hasModeratorRole,
    hasStaffRole,
    canExecuteModeration,
    canExecuteAutomod,
    canExecuteMusic,
    getPermissionError,
    getRoleError
}; 