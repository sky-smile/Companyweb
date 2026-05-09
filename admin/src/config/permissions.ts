// 权限中文映射配置
// 用于将权限代码转换为可读的中文名称

export interface PermissionDefinition {
  code: string;
  name: string;
  description?: string;
}

export interface PermissionGroup {
  key: string;
  title: string;
  permissions: PermissionDefinition[];
}

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    key: 'admin-users',
    title: '管理员管理',
    permissions: [
      { code: 'admin-users:view', name: '查看管理员', description: '查看管理员列表和详情' },
      { code: 'admin-users:create', name: '创建管理员', description: '创建新的管理员账号' },
      { code: 'admin-users:update', name: '编辑管理员', description: '编辑管理员信息' },
      { code: 'admin-users:status', name: '切换管理员状态', description: '启用/禁用管理员账号' },
      { code: 'admin-users:reset-password', name: '重置密码', description: '重置其他管理员密码' },
      { code: 'admin-users:change-password', name: '修改自己的密码', description: '修改当前登录账号的密码' },
      { code: 'admin-users:delete', name: '删除管理员', description: '删除管理员账号' },
    ],
  },
  {
    key: 'roles',
    title: '角色管理',
    permissions: [
      { code: 'roles:view', name: '查看角色', description: '查看角色列表和权限' },
      { code: 'roles:create', name: '创建角色', description: '创建新的角色' },
      { code: 'roles:update', name: '编辑角色', description: '编辑角色信息和权限' },
      { code: 'roles:status', name: '切换角色状态', description: '启用/禁用角色' },
      { code: 'roles:delete', name: '删除角色', description: '删除角色' },
    ],
  },
  {
    key: 'news',
    title: '新闻管理',
    permissions: [
      { code: 'news:view', name: '查看新闻', description: '查看新闻列表和详情' },
      { code: 'news:create', name: '创建新闻', description: '发布新新闻' },
      { code: 'news:update', name: '编辑新闻', description: '编辑已有新闻' },
      { code: 'news:delete', name: '删除新闻', description: '删除新闻' },
    ],
  },
  {
    key: 'news-category',
    title: '新闻分类',
    permissions: [
      { code: 'news-category:view', name: '查看新闻分类', description: '查看新闻分类列表' },
      { code: 'news-category:create', name: '创建新闻分类', description: '添加新闻分类' },
      { code: 'news-category:update', name: '编辑新闻分类', description: '编辑新闻分类' },
      { code: 'news-category:delete', name: '删除新闻分类', description: '删除新闻分类' },
    ],
  },
  {
    key: 'announcement',
    title: '公告管理',
    permissions: [
      { code: 'announcement:view', name: '查看公告', description: '查看公告列表和详情' },
      { code: 'announcement:create', name: '创建公告', description: '发布新公告' },
      { code: 'announcement:update', name: '编辑公告', description: '编辑已有公告' },
      { code: 'announcement:delete', name: '删除公告', description: '删除公告' },
    ],
  },
  {
    key: 'product',
    title: '产品管理',
    permissions: [
      { code: 'product:view', name: '查看产品', description: '查看产品列表和详情' },
      { code: 'product:create', name: '创建产品', description: '添加新产品' },
      { code: 'product:update', name: '编辑产品', description: '编辑产品信息' },
      { code: 'product:delete', name: '删除产品', description: '删除产品' },
    ],
  },
  {
    key: 'product-category',
    title: '产品分类',
    permissions: [
      { code: 'product-category:view', name: '查看产品分类', description: '查看产品分类列表' },
      { code: 'product-category:create', name: '创建产品分类', description: '添加产品分类' },
      { code: 'product-category:update', name: '编辑产品分类', description: '编辑产品分类' },
      { code: 'product-category:delete', name: '删除产品分类', description: '删除产品分类' },
    ],
  },
  {
    key: 'site-page',
    title: '页面内容',
    permissions: [
      { code: 'site-page:view', name: '查看页面内容', description: '查看静态页面内容' },
      { code: 'site-page:update', name: '编辑页面内容', description: '编辑静态页面内容' },
    ],
  },
  {
    key: 'banner',
    title: 'Banner 管理',
    permissions: [
      { code: 'banner:view', name: '查看 Banner', description: '查看 Banner 列表' },
      { code: 'banner:create', name: '创建 Banner', description: '添加新 Banner' },
      { code: 'banner:update', name: '编辑 Banner', description: '编辑 Banner 信息' },
      { code: 'banner:delete', name: '删除 Banner', description: '删除 Banner' },
    ],
  },
  {
    key: 'site-setting',
    title: '站点设置',
    permissions: [
      { code: 'site-setting:view', name: '查看站点设置', description: '查看站点配置' },
      { code: 'site-setting:update', name: '编辑站点设置', description: '修改站点配置' },
    ],
  },
  {
    key: 'upload',
    title: '上传管理',
    permissions: [
      { code: 'upload:image', name: '上传图片', description: '上传图片文件' },
      { code: 'upload:file', name: '上传文件', description: '上传普通文件' },
    ],
  },
];

// 权限代码到中文名称的映射表
export const PERMISSION_NAME_MAP: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  PERMISSION_GROUPS.forEach((group) => {
    group.permissions.forEach((perm) => {
      map[perm.code] = perm.name;
    });
  });
  return map;
})();

// 权限代码到描述的映射表
export const PERMISSION_DESCRIPTION_MAP: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  PERMISSION_GROUPS.forEach((group) => {
    group.permissions.forEach((perm) => {
      if (perm.description) {
        map[perm.code] = perm.description;
      }
    });
  });
  return map;
})();

// 获取权限的中文名称
export function getPermissionName(code: string): string {
  return PERMISSION_NAME_MAP[code] || code;
}

// 获取权限的描述
export function getPermissionDescription(code: string): string {
  return PERMISSION_DESCRIPTION_MAP[code] || '';
}

// 获取权限所属分组
export function getPermissionGroupByKey(code: string): PermissionGroup | undefined {
  return PERMISSION_GROUPS.find((group) => code.startsWith(group.key));
}

// 按分组组织权限列表
export function groupPermissionsByGroup(permissions: Array<{ code: string; name?: string }>) {
  const result: { group: PermissionGroup; permissions: Array<{ code: string; name?: string }> }[] = [];
  
  PERMISSION_GROUPS.forEach((group) => {
    const groupPerms = permissions.filter((p) => p.code.startsWith(group.key));
    if (groupPerms.length > 0) {
      result.push({ group, permissions: groupPerms });
    }
  });
  
  return result;
}
