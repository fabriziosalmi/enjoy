import * as fs from 'fs';
import * as yaml from 'js-yaml';

export interface GameConfig {
  game: {
    name: string;
    version: string;
    max_level: number;
    github_pages_unlock_level: number;
  };
  karma: {
    amplification: {
      x1_threshold: number;
      x2_threshold: number;
      x3_threshold: number;
    };
    scoring: {
      base_score: number;
      word_length: {
        optimal_min: number;
        optimal_max: number;
        optimal_bonus: number;
        too_short_penalty: number;
        too_long_penalty: number;
      };
      boring_word_penalty: number;
      well_formed_bonus: number;
      suspicious_pattern_penalty: number;
      duplicate_penalty: number;
      descriptive_commit_bonus: number;
      experienced_contributor_bonus: number;
    };
    boring_words: string[];
  };
  decay: {
    enabled: boolean;
    karma_decay: {
      start_after_days: number;
      daily_percentage: number;
      minimum_karma: number;
    };
    level_decay: {
      start_after_days: number;
      levels_per_period: number;
      period_days: number;
      minimum_level: number;
    };
  };
  referrals: {
    enabled: boolean;
    propagation: {
      direct_bonus_percentage: number;
      chain_depth_max: number;
      chain_decay_percentage: number;
    };
    achievements: {
      first_referral: number;
      recruiter_5: number;
      recruiter_10: number;
      chain_master: number;
    };
  };
  validation: {
    format: {
      word_min_length: number;
      word_max_length: number;
      min_checked_boxes: number;
      sacred_answers: string[];
    };
    files: {
      max_files_per_pr: number;
      allowed_extensions: string[];
      contribution_path: string;
    };
  };
  rate_limits: {
    max_prs_per_user_per_day: number;
    max_prs_per_user_per_hour: number;
    cooldown_after_rejection_minutes: number;
  };
  leaderboard: {
    display_count: number;
    update_frequency: string;
    boards: Array<{
      type: string;
      title: string;
      sort_by: string;
    }>;
  };
}

let cachedConfig: GameConfig | null = null;

/**
 * Load game configuration from YAML file
 */
export function loadConfig(configPath?: string): GameConfig {
  if (cachedConfig) {
    return cachedConfig;
  }

  const paths = [
    configPath,
    'game-config.yaml',
    '../game-config.yaml',
    '../../game-config.yaml'
  ].filter(Boolean) as string[];

  for (const path of paths) {
    try {
      if (fs.existsSync(path)) {
        const content = fs.readFileSync(path, 'utf8');
        cachedConfig = yaml.load(content) as GameConfig;
        console.log(`✅ Loaded config from ${path}`);
        return cachedConfig;
      }
    } catch {
      // Try next path
    }
  }

  // Return defaults if no config found
  console.warn('⚠️ No game-config.yaml found, using defaults');
  return getDefaultConfig();
}

/**
 * Get default configuration (fallback)
 */
function getDefaultConfig(): GameConfig {
  return {
    game: {
      name: "Enjoy and contribute!",
      version: "1.0.0",
      max_level: 100,
      github_pages_unlock_level: 95
    },
    karma: {
      amplification: {
        x1_threshold: 0,
        x2_threshold: 50,
        x3_threshold: 80
      },
      scoring: {
        base_score: 50,
        word_length: {
          optimal_min: 5,
          optimal_max: 10,
          optimal_bonus: 10,
          too_short_penalty: -15,
          too_long_penalty: -10
        },
        boring_word_penalty: -20,
        well_formed_bonus: 10,
        suspicious_pattern_penalty: -15,
        duplicate_penalty: -30,
        descriptive_commit_bonus: 5,
        experienced_contributor_bonus: 5
      },
      boring_words: ['test', 'hello', 'world', 'foo', 'bar', 'spam', 'qwerty']
    },
    decay: {
      enabled: true,
      karma_decay: {
        start_after_days: 7,
        daily_percentage: 2,
        minimum_karma: 0
      },
      level_decay: {
        start_after_days: 14,
        levels_per_period: 1,
        period_days: 7,
        minimum_level: 1
      }
    },
    referrals: {
      enabled: true,
      propagation: {
        direct_bonus_percentage: 50,
        chain_depth_max: 3,
        chain_decay_percentage: 50
      },
      achievements: {
        first_referral: 10,
        recruiter_5: 25,
        recruiter_10: 50,
        chain_master: 100
      }
    },
    validation: {
      format: {
        word_min_length: 3,
        word_max_length: 30,
        min_checked_boxes: 3,
        sacred_answers: ['karmiel', 'KARMIEL', 'Karmiel']
      },
      files: {
        max_files_per_pr: 1,
        allowed_extensions: ['.txt'],
        contribution_path: 'contributions/'
      }
    },
    rate_limits: {
      max_prs_per_user_per_day: 5,
      max_prs_per_user_per_hour: 2,
      cooldown_after_rejection_minutes: 30
    },
    leaderboard: {
      display_count: 50,
      update_frequency: 'on_merge',
      boards: [
        { type: 'contributors', title: '🏆 Top Contributors', sort_by: 'karma' },
        { type: 'recruiters', title: '🔗 Top Recruiters', sort_by: 'referral_karma' }
      ]
    }
  };
}

/**
 * Clear cached config (for testing)
 */
export function clearConfigCache(): void {
  cachedConfig = null;
}
