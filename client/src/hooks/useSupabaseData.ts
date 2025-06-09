import { useState, useEffect } from 'react';
import { supabase } from '@shared/supabase';
import type { 
  Course, 
  Grimoire, 
  BlogPost, 
  DailyPoem,
  CreateCourse,
  CreateGrimoire,
  CreateBlogPost,
  CreateDailyPoem 
} from '@shared/supabase';

export function useSupabaseData() {
  // Courses
  const useCourses = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      fetchCourses();
    }, []);

    const fetchCourses = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setCourses(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const createCourse = async (courseData: CreateCourse) => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .insert(courseData)
          .select()
          .single();

        if (error) throw error;
        setCourses(prev => [data, ...prev]);
        return { data, error: null };
      } catch (err: any) {
        return { data: null, error: err.message };
      }
    };

    return { courses, loading, error, fetchCourses, createCourse };
  };

  // Grimoires
  const useGrimoires = () => {
    const [grimoires, setGrimoires] = useState<Grimoire[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      fetchGrimoires();
    }, []);

    const fetchGrimoires = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('grimoires')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setGrimoires(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const createGrimoire = async (grimoireData: CreateGrimoire) => {
      try {
        const { data, error } = await supabase
          .from('grimoires')
          .insert(grimoireData)
          .select()
          .single();

        if (error) throw error;
        setGrimoires(prev => [data, ...prev]);
        return { data, error: null };
      } catch (err: any) {
        return { data: null, error: err.message };
      }
    };

    return { grimoires, loading, error, fetchGrimoires, createGrimoire };
  };

  // Blog Posts
  const useBlogPosts = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      fetchPosts();
    }, []);

    const fetchPosts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('is_published', true)
          .order('published_at', { ascending: false });

        if (error) throw error;
        setPosts(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const createPost = async (postData: CreateBlogPost) => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .insert(postData)
          .select()
          .single();

        if (error) throw error;
        setPosts(prev => [data, ...prev]);
        return { data, error: null };
      } catch (err: any) {
        return { data: null, error: err.message };
      }
    };

    return { posts, loading, error, fetchPosts, createPost };
  };

  // Daily Poems
  const useDailyPoems = () => {
    const [poems, setPoems] = useState<DailyPoem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      fetchPoems();
    }, []);

    const fetchPoems = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('daily_poems')
          .select('*')
          .order('date', { ascending: false })
          .limit(10);

        if (error) throw error;
        setPoems(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const createPoem = async (poemData: CreateDailyPoem) => {
      try {
        const { data, error } = await supabase
          .from('daily_poems')
          .insert(poemData)
          .select()
          .single();

        if (error) throw error;
        setPoems(prev => [data, ...prev]);
        return { data, error: null };
      } catch (err: any) {
        return { data: null, error: err.message };
      }
    };

    return { poems, loading, error, fetchPoems, createPoem };
  };

  // Real-time subscriptions
  const useRealtimeSubscription = (table: string, callback: (payload: any) => void) => {
    useEffect(() => {
      const subscription = supabase
        .channel(`public:${table}`)
        .on('postgres_changes', 
          { event: '*', schema: 'public', table }, 
          callback
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }, [table, callback]);
  };

  return {
    useCourses,
    useGrimoires,
    useBlogPosts,
    useDailyPoems,
    useRealtimeSubscription,
  };
}