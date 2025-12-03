// Deploy Service - Handle Vercel/Netlify deployments
import { logger } from '@/lib/logger';

const VERCEL_DEPLOY_HOOK = process.env.VERCEL_DEPLOY_HOOK;
const NETLIFY_BUILD_HOOK = process.env.NETLIFY_BUILD_HOOK;
const DEPLOY_PROVIDER = process.env.DEPLOY_PROVIDER || 'vercel'; // 'vercel' or 'netlify'

class DeployService {
  /**
   * Trigger deployment/revalidation for a store
   */
  async triggerDeploy(storeSlug: string): Promise<boolean> {
    try {
      if (DEPLOY_PROVIDER === 'vercel') {
        return await this.triggerVercelRevalidate(storeSlug);
      } else if (DEPLOY_PROVIDER === 'netlify') {
        return await this.triggerNetlifyBuild();
      }
      
      logger.warn('No deploy provider configured');
      return true; // Don't fail if no provider
    } catch (error) {
      logger.error('Deploy trigger failed', error, { storeSlug });
      return false;
    }
  }

  /**
   * Trigger Vercel on-demand revalidation
   * More efficient than full rebuild
   */
  private async triggerVercelRevalidate(storeSlug: string): Promise<boolean> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const secret = process.env.REVALIDATE_SECRET;

      if (!secret) {
        logger.warn('REVALIDATE_SECRET not set');
        return true;
      }

      const response = await fetch(`${baseUrl}/api/revalidate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-revalidate-secret': secret,
        },
        body: JSON.stringify({ slug: storeSlug }),
      });

      if (!response.ok) {
        throw new Error(`Revalidation failed: ${response.status}`);
      }

      logger.info('Vercel revalidation triggered', { storeSlug });
      return true;
    } catch (error) {
      logger.error('Vercel revalidation failed', error);
      return false;
    }
  }

  /**
   * Trigger Netlify full rebuild
   */
  private async triggerNetlifyBuild(): Promise<boolean> {
    try {
      if (!NETLIFY_BUILD_HOOK) {
        logger.warn('NETLIFY_BUILD_HOOK not set');
        return true;
      }

      const response = await fetch(NETLIFY_BUILD_HOOK, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`Netlify build trigger failed: ${response.status}`);
      }

      logger.info('Netlify build triggered');
      return true;
    } catch (error) {
      logger.error('Netlify build trigger failed', error);
      return false;
    }
  }

  /**
   * Trigger Vercel deploy hook (full rebuild)
   * Use sparingly - for major changes only
   */
  async triggerFullDeploy(): Promise<boolean> {
    try {
      if (!VERCEL_DEPLOY_HOOK) {
        logger.warn('VERCEL_DEPLOY_HOOK not set');
        return true;
      }

      const response = await fetch(VERCEL_DEPLOY_HOOK, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`Deploy hook failed: ${response.status}`);
      }

      logger.info('Full deployment triggered');
      return true;
    } catch (error) {
      logger.error('Full deployment failed', error);
      return false;
    }
  }

  /**
   * Check deployment status (placeholder)
   * Could integrate with Vercel/Netlify APIs
   */
  async checkDeployStatus(deploymentId: string): Promise<'pending' | 'building' | 'ready' | 'error'> {
    // TODO: Implement actual status check via Vercel/Netlify API
    logger.debug('Checking deploy status', { deploymentId });
    return 'ready';
  }
}

export const deployService = new DeployService();
