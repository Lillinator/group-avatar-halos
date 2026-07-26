import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "discourse-avatar-halos",

  initialize() {
    withPluginApi("0.8", (api) => {
      
      api.addPostClassesCallback((post) => {
        let classes = [];
        if (post.admin) classes.push("halo-post-admins");
        if (post.moderator) classes.push("halo-post-moderators");
        if (post.staff) classes.push("halo-post-staff");
        
        if (post.primary_group_name) {
          classes.push(`halo-post-${post.primary_group_name}`);
        }
        
        if (post.trust_level !== undefined) {
          classes.push(`halo-post-trust_level_${post.trust_level}`);
        }
        
        return classes;
      });

      api.customUserAvatarClasses((user) => {
        if (!user) return [];
        let classes = [];
        const getProp = (prop) => user[prop] ?? (user.get && user.get(prop));
        
        if (getProp("admin")) classes.push("halo-user-admins");
        if (getProp("moderator")) classes.push("halo-user-moderators");
        if (getProp("staff")) classes.push("halo-user-staff");
        
        const primaryGroup = getProp("primary_group_name");
        if (primaryGroup) {
          classes.push(`halo-user-${primaryGroup}`);
        }
        
        const trustLevel = getProp("trust_level");
        if (trustLevel !== undefined) {
          classes.push(`halo-user-trust_level_${trustLevel}`);
        }
        
        return classes;
      });

      let halos = settings.avatar_halos;

      if (typeof halos === "string") {
        try {
          halos = JSON.parse(halos);
        } catch (e) {
          return;
        }
      }

      if (!halos || !halos.length) return;

      const site = api.container.lookup("service:site");
      const siteGroups = site.get("groups") || [];

      let trustLevelCssRules = "";
      let regularCssRules = "";
      let staffCssRules = ""; 

      const sizeMap = {
        small: "4px 4px",
        medium: "6px 6px",
        large: "8px 8px",
      };

      const percentMap = {
        "0.25": "25%",
        "0.5": "50%",
        "0.75": "75%",
        "1.0": "100%",
      };

      halos.forEach((rule) => {
        if (rule.groups) { 
          let groupIds = rule.groups;
          if (typeof groupIds === "string") groupIds = groupIds.split(",");
          if (!Array.isArray(groupIds)) groupIds = [groupIds];

          const color = rule.halo_color || "var(--tertiary)";
          const shadowSize = sizeMap[rule.halo_size] || sizeMap["medium"];
          const alphaPercent = percentMap[rule.halo_transparency] || "50%";

          groupIds.forEach((id) => {
            const matchedGroup = siteGroups.find((g) => g.id === parseInt(id, 10));

            if (matchedGroup) {
              const isStaff = [1, 2, 3].includes(matchedGroup.id);
              const isTrustLevel = matchedGroup.id >= 10 && matchedGroup.id <= 14;
              
              let cssString = `
                .halo-post-${matchedGroup.name} .topic-avatar img.avatar,
                img.avatar.halo-user-${matchedGroup.name} {
                  box-shadow: 0 0 ${shadowSize} color-mix(in srgb, ${color} ${alphaPercent}, transparent) !important;
                }
              `;

              if (isStaff) {
                staffCssRules += cssString;
              } else if (isTrustLevel) {
                trustLevelCssRules += cssString;
              } else {
                regularCssRules += cssString;
              }
            }
          });
        }
      });

      let finalCss = trustLevelCssRules + regularCssRules + staffCssRules;

      if (finalCss) {
        finalCss += `
          #current-user img.avatar,      /* Hides halo in the top-right header */
          .topic-map__users-list img.avatar,
          .topic-map img.avatar,
          section.map img.avatar {
            box-shadow: none !important;
            border: none !important;
          }
        `;

        const styleNode = document.createElement("style");
        styleNode.type = "text/css";
        styleNode.innerHTML = finalCss;
        document.head.appendChild(styleNode);
      }
    });
  },
};
